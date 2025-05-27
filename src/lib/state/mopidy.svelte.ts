import { themeFromImage } from "@material/material-color-utilities";
import { BASE_URL, WS_URL } from "$lib/constants";
import * as lrclib from "$lib/lrclib";
import { brand } from "$lib/types/brand";
import {
    type AlbumURI,
    type AlbumWithTracks,
    type AnyTrack,
    type AnyTracks,
    type ArtistURI,
    type ArtistWithAlbums,
    type Directory,
    type DirectoryURI,
    type HistoryEntry,
    model,
    models,
    type ModelURI,
    type PlaybackState,
    type Playlist,
    type PlaylistURI,
    type TlTrack,
    type Track,
    type TrackLyrics,
    type TrackRef,
    type TrackURI,
} from "$lib/types/mopidy";
import Mopidy from "mopidy";
import { SvelteMap } from "svelte/reactivity";

class MopidyState {
    // @sort Tracklist

    get nextTrack() {
        return this.#nextTrack;
    }

    get previousTrack() {
        return this.#previousTrack;
    }

    get queue() {
        return this.#queue;
    }

    #nextTrack = $state<null | TlTrack>(null);

    #previousTrack: null | TlTrack = null;

    #queue = $state<TlTrack[]>([]);

    async addToQueue(tracks: AnyTrack | AnyTracks) {
        if (!this.#base.tracklist) return;

        try {
            await this.#base.tracklist.add(this.#normalizeTracks(tracks));
        } catch (e: unknown) {
            console.error("Failed to add tracks to queue");
            console.error(e);
        }
    }

    async clearQueue() {
        if (!this.#base.tracklist) return;

        try {
            await this.#base.tracklist.clear();
        } catch (e: unknown) {
            console.error("Failed to clear queue");
            console.error(e);
        }
    }

    async playNext(tracks: AnyTrack | AnyTracks) {
        if (!this.#base.tracklist || !this.#base.playback) return;

        try {
            await this.#base.tracklist.add({
                ...this.#normalizeTracks(tracks),
                at_position: 1,
            });
            await this.#base.playback.play({});
        } catch (e: unknown) {
            console.error("Failed to play tracks next");
            console.error(e);
        }
    }

    async playNow(tracks: AnyTrack | AnyTracks) {
        if (!this.#base.tracklist || !this.#base.playback) return;

        try {
            await this.#base.tracklist.clear();
            await this.#base.tracklist.add(this.#normalizeTracks(tracks));
            await this.#base.playback.play({});
        } catch (e: unknown) {
            console.error("Failed to play tracks now");
            console.error(e);
        }
    }

    async removeFromQueue(tlid: number) {
        if (!this.#base.tracklist) return;

        try {
            await this.#base.tracklist.remove({
                criteria: {
                    // @ts-expect-error: Types are wrong
                    tlid: [tlid],
                },
            });
        } catch (e: unknown) {
            console.error("Failed to remove track from queue");
            console.error(e);
        }
    }

    async shuffleQueue() {
        if (!this.#base.tracklist) return;

        try {
            await this.#base.tracklist.shuffle({});
        } catch (e: unknown) {
            console.error("Failed to shuffle queue");
            console.error(e);
        }
    }

    #normalizeTracks(tracks: AnyTrack | AnyTracks) {
        const trackArray = Array.isArray(tracks)
            ? tracks
            : ([tracks] as TlTrack[] | Track[] | TrackURI[]);

        if (trackArray.length < 1) return {};

        if (typeof trackArray[0] === "string")
            return { uris: trackArray as TrackURI[] };

        if ("uri" in trackArray[0])
            return { uris: (trackArray as TrackRef[]).map((t) => t.uri) };

        return {
            tracks:
                "track" in trackArray[0]
                    ? (trackArray as TlTrack[]).map((t) => t.track)
                    : (trackArray as Track[]),
        };
    }

    async #updateNextTrack() {
        if (!this.#base.tracklist) return;

        try {
            const tlid = await this.#base.tracklist.getNextTlid();

            if (tlid === null) {
                this.#nextTrack = null;
                return;
            }

            this.#nextTrack =
                this.queue.find((track) => track.tlid === tlid) ?? null;
        } catch (e: unknown) {
            console.error("Failed to get next track");
            console.error(e);
        }
    }

    async #updatePreviousTrack() {
        if (!this.#base.tracklist) return;

        try {
            const tlid = await this.#base.tracklist.getPreviousTlid();

            if (tlid === null) {
                this.#previousTrack = null;
                return;
            }

            this.#previousTrack =
                this.queue.find((track) => track.tlid === tlid) ?? null;
        } catch (e: unknown) {
            console.error("Failed to get previous track");
            console.error(e);
        }
    }

    async #updateQueue() {
        if (!this.#base.tracklist) return;

        try {
            this.#queue =
                (await this.#base.tracklist.getTlTracks()) as TlTrack[];
        } catch (e: unknown) {
            console.error("Failed to get queue");
            console.error(e);
        }
    }

    // @sort Playback

    get consume() {
        return this.#consume;
    }
    set consume(value: boolean) {
        void this.#base.tracklist?.setConsume({ value });
    }

    get currentTrack() {
        return this.#currentTrack;
    }

    get playbackState() {
        return this.#playbackState;
    }
    set playbackState(playbackState: PlaybackState) {
        switch (playbackState) {
            case "paused":
                void this.#base.playback?.pause();
                break;
            case "playing":
                void this.#base.playback?.resume();
                break;
            case "stopped":
                void this.#base.playback?.stop();
                break;
            default:
                console.error("Unknown playback state");
                break;
        }
    }

    get repeat() {
        return this.#repeat;
    }
    set repeat(value: boolean) {
        void this.#base.tracklist?.setRepeat({ value });
    }

    get shuffle() {
        return this.#shuffle;
    }
    set shuffle(value: boolean) {
        void this.#base.tracklist?.setRandom({ value });
    }

    get single() {
        return this.#single;
    }
    set single(value: boolean) {
        void this.#base.tracklist?.setSingle({ value });
    }

    get timePosition() {
        return this.#timePosition;
    }
    set timePosition(timePosition: null | number) {
        if (timePosition !== null)
            void this.#base.playback
                ?.seek({ time_position: timePosition })
                .then(() => void this.#updateTimePosition())
                .catch((e: unknown) => {
                    console.error("Failed to set time position");
                    console.error(e);
                });
    }

    #consume = $state(false);

    #currentTrack = $state<null | TlTrack>(null);

    #playbackState = $state<PlaybackState>("stopped");

    #repeat = $state(false);

    #shuffle = $state(false);

    #single = $state(false);

    #timePosition = $state<null | number>(null);

    skipNext() {
        void this.#base.playback?.next();
    }

    skipPrevious() {
        void this.#base.playback?.previous();
    }

    togglePlaybackState() {
        switch (this.playbackState) {
            case "paused":
                this.playbackState = "playing";
                break;
            case "playing":
                this.playbackState = "paused";
                break;
            case "stopped":
                break;
            default:
                console.error("Unknown playback state");
                break;
        }
    }

    async #setCurrentTrack(track: null | TlTrack) {
        this.#currentTrack = track;

        if (track)
            try {
                const lyricPromise = this.requestLyrics(track.track);

                const image = (await this.requestImages([track.track.uri]))?.at(
                    0,
                );

                if (image) await this.requestPalette(image);

                await lyricPromise;
            } catch (e: unknown) {
                console.error("Failed to get image, palette, or lyrics");
                console.error(e);
            }
    }

    async #updateConsume() {
        if (!this.#base.tracklist) return;

        try {
            this.#consume = await this.#base.tracklist.getConsume();
        } catch (e: unknown) {
            console.error("Failed to get consume");
            console.error(e);
        }
    }

    async #updateCurrentTrack() {
        if (!this.#base.playback) return;

        try {
            await this.#setCurrentTrack(
                (await this.#base.playback.getCurrentTlTrack()) as TlTrack,
            );
        } catch (e: unknown) {
            console.error("Failed to get current track");
            console.error(e);
        }
    }

    async #updatePlaybackState() {
        if (!this.#base.playback) return;

        try {
            this.#playbackState = await this.#base.playback.getState();
        } catch (e: unknown) {
            console.error("Failed to get playback state");
            console.error(e);
        }
    }

    async #updateRepeat() {
        if (!this.#base.tracklist) return;

        try {
            this.#repeat = await this.#base.tracklist.getRepeat();
        } catch (e: unknown) {
            console.error("Failed to get repeat");
            console.error(e);
        }
    }

    async #updateShuffle() {
        if (!this.#base.tracklist) return;

        try {
            this.#shuffle = await this.#base.tracklist.getRandom();
        } catch (e: unknown) {
            console.error("Failed to get shuffle");
            console.error(e);
        }
    }

    async #updateSingle() {
        if (!this.#base.tracklist) return;

        try {
            this.#single = await this.#base.tracklist.getSingle();
        } catch (e: unknown) {
            console.error("Failed to get single");
            console.error(e);
        }
    }

    async #updateTimePosition() {
        if (!this.#base.playback) return;

        try {
            this.#timePosition = await this.#base.playback.getTimePosition();
        } catch (e: unknown) {
            console.error("Failed to get time position");
            console.error(e);
        }
    }

    // @sort Library

    get albums() {
        return this.#albums.values().toArray();
    }

    get artists() {
        return this.#artists.values().toArray();
    }

    get currentTrackImage() {
        return this.#currentTrackImage;
    }

    get directories() {
        return this.#directories.values().toArray();
    }

    get tracks() {
        return this.#tracks.values().toArray();
    }

    #albums = new SvelteMap<AlbumURI, AlbumWithTracks>();

    #artists = new SvelteMap<ArtistURI, ArtistWithAlbums>();

    #directories = new SvelteMap<DirectoryURI | null, Directory>();

    #tracks = new SvelteMap<TrackURI, Track>();

    getAlbum(uri: AlbumURI) {
        return this.#albums.get(uri);
    }

    getArtist(uri: ArtistURI) {
        return this.#artists.get(uri);
    }

    getDirectory(uri: DirectoryURI | null) {
        return this.#directories.get(uri);
    }

    getTrack(uri: TrackURI) {
        return this.#tracks.get(uri);
    }

    async #getTracks(uri: ModelURI) {
        if (!this.#base.library) return;

        try {
            return models(
                (
                    await this.#base.library.lookup({
                        uris: [uri],
                    })
                )[uri],
            );
        } catch (e: unknown) {
            console.error("Failed to get tracks");
            console.error(e);
        }
    }

    async #updateAlbum(uri: AlbumURI) {
        if (!this.#base.library) return;

        try {
            const tracks = await this.#getTracks(uri);
            const album = tracks?.at(0)?.album;

            if (!album) return;

            const albumWithTracks = {
                ...album,
                tracks,
            };

            this.#albums.set(uri, albumWithTracks);

            for (const artist of albumWithTracks.artists)
                this.#artists.get(artist.uri)?.albums.push(albumWithTracks);

            return albumWithTracks;
        } catch (e: unknown) {
            console.error("Failed to get album");
            console.error(e);
        }
    }

    async #updateArtist(uri: ArtistURI) {
        if (!this.#base.library) return;

        try {
            const tracks = await this.#getTracks(uri);
            const artist = tracks
                ?.flatMap((track) => track.artists)
                .find((artist) => artist.uri === uri);

            if (!artist) return;

            const artistWithAlbums: ArtistWithAlbums = {
                ...artist,
                albums: this.#albums
                    .values()
                    .toArray()
                    .filter((album) =>
                        album.artists.some((a) => a.uri === uri),
                    ),
            };

            this.#artists.set(uri, artistWithAlbums);

            return artistWithAlbums;
        } catch (e: unknown) {
            console.error("Failed to get artist");
            console.error(e);
        }
    }

    async #updateDirectory(uri: DirectoryURI | null, name?: string) {
        if (!this.#base.library) return;

        try {
            const directory = models(
                await this.#base.library.browse({
                    // @ts-expect-error: It should accept null
                    uri,
                }),
            );

            this.#directories.set(uri, {
                children: directory,
                name,
                uri,
            });

            await Promise.allSettled(
                directory.map((item) => {
                    switch (item.type) {
                        case "album":
                            return this.#updateAlbum(item.uri);
                        case "artist":
                            return this.#updateArtist(item.uri);
                        case "directory":
                            return this.#updateDirectory(item.uri, item.name);
                        case "track":
                            return this.#updateTrack(item.uri);
                    }
                }),
            );

            return directory;
        } catch (e: unknown) {
            console.error("Failed to walk directory");
            console.error(e);
        }
    }

    async #updateTrack(uri: TrackURI) {
        if (!this.#base.library) return;

        try {
            const tracks = await this.#getTracks(uri);

            if (tracks?.length !== 1) return;

            this.#tracks.set(uri, tracks[0]);

            return tracks[0];
        } catch (e: unknown) {
            console.error("Failed to get track");
            console.error(e);
        }
    }

    // @sort Playlists

    get playlists() {
        return this.#playlists.values().toArray();
    }

    #playlists = new SvelteMap<PlaylistURI, Playlist>();

    getPlaylist(uri: PlaylistURI) {
        return this.#playlists.get(uri);
    }

    async #updatePlaylists() {
        if (!this.#base.playlists) return;

        try {
            await Promise.allSettled(
                models(await this.#base.playlists.asList())
                    .filter((ref) => ref.type === "playlist")
                    .map(async ({ uri }) => {
                        const playlist = await this.#base.playlists?.lookup({
                            uri,
                        });

                        if (!playlist) return;

                        this.#playlists.set(uri, model(playlist));
                    }),
            );
        } catch (e: unknown) {
            console.error("Failed to get playlists");
            console.error(e);
        }
    }

    // @sort Mixer

    get mute() {
        return this.#mute;
    }
    set mute(mute: boolean) {
        void this.#base.mixer?.setMute({ mute });
    }

    get volume() {
        return this.#volume;
    }
    set volume(volume: number) {
        void this.#base.mixer?.setVolume({ volume });
    }

    #mute = $state(false);

    #volume = $state(100);

    async #updateMute() {
        if (!this.#base.mixer) return;

        try {
            this.#mute = (await this.#base.mixer.getMute()) ?? false;
        } catch (e: unknown) {
            console.error("Failed to get mute");
            console.error(e);
        }
    }

    async #updateVolume() {
        if (!this.#base.mixer) return;

        try {
            this.#volume = (await this.#base.mixer.getVolume()) ?? 100;
        } catch (e: unknown) {
            console.error("Failed to get volume");
            console.error(e);
        }
    }

    // @sort History

    get history() {
        return this.#history;
    }

    #history = $state<HistoryEntry[]>([]);

    async #updateHistory() {
        if (!this.#base.history) return;

        try {
            this.#history = (
                (await this.#base.history.getHistory()) as unknown as [
                    number,
                    TrackRef,
                ][]
            ).map(([date, track]) => ({
                timestamp: new Date(date),
                track,
            }));
        } catch (e: unknown) {
            console.error("Failed to get history");
            console.error(e);
        }
    }

    // @sort Images

    #currentTrackImage: null | string = $derived(
        this.#currentTrack
            ? (this.getImage(this.#currentTrack.track.uri) ?? null)
            : null,
    );

    #images = new SvelteMap<ModelURI, string>();

    getImage(uri: ModelURI) {
        return this.#images.get(uri);
    }

    async requestImages(uris: ModelURI[]) {
        try {
            const images =
                (await this.#base.library?.getImages({
                    uris: uris.filter((uri) => !this.#images.has(uri)),
                })) ?? {};

            for (const [uri, imageList] of Object.entries(images)) {
                const image = imageList.at(0);

                if (!image) continue;

                const url = new URL(image.uri, BASE_URL).toString();
                this.#images.set(brand(uri), url);
            }

            return uris.map((uri) => this.#images.get(uri));
        } catch (e) {
            console.error("Failed to get images");
            console.error(e);
        }
    }

    // @sort Palette

    get currentTrackPalette() {
        return this.#currentTrackPalette;
    }

    #currentTrackPalette: null | string = $derived(
        this.#currentTrackImage
            ? (this.getPalette(this.#currentTrackImage) ?? null)
            : null,
    );

    #palettes = new SvelteMap<string, string>();

    getPalette(url: string) {
        return this.#palettes.get(url);
    }

    async requestPalette(url: string) {
        if (this.#palettes.has(url)) return this.#palettes.get(url);

        const img = new Image();
        img.crossOrigin = "";
        img.src = url;

        try {
            const theme = await themeFromImage(img);

            this.#palettes.set(
                url,
                Object.entries(theme.palettes)
                    .flatMap(([k, p]) =>
                        [
                            0, 4, 5, 6, 10, 12, 15, 17, 20, 22, 25, 30, 35, 40,
                            50, 60, 70, 80, 90, 92, 94, 95, 96, 98, 99, 100,
                        ].map(
                            (v) =>
                                `--color-${k.replace("V", "-v")}-${v.toString()}: #${(p.tone(v) & 0xffffff).toString(16).padStart(6, "0")}`,
                        ),
                    )
                    .join(";"),
            );

            return this.#palettes.get(url);
        } catch (e: unknown) {
            console.error("Failed to get palette");
            console.error(e);
        }
    }

    // @sort Lyrics

    get currentTrackLyrics() {
        return this.#currentTrackLyrics;
    }

    #currentTrackLyrics: null | TrackLyrics = $derived(
        this.#currentTrack
            ? (this.getLyrics(this.#currentTrack.track.uri) ?? null)
            : null,
    );

    #lyrics = new SvelteMap<TrackURI, TrackLyrics>();

    getLyrics(uri: TrackURI) {
        return this.#lyrics.get(uri);
    }

    async requestLyrics(track: Track) {
        const uri = track.uri;

        if (this.#lyrics.has(uri)) return this.#lyrics.get(uri);

        try {
            const response = await lrclib.get({
                albumName: track.album.name,
                artistName: track.artists.map((a) => a.name).join(", "),
                duration: Math.round(track.length / 1000),
                trackName: track.name,
            });

            if (!response.syncedLyrics) {
                this.#lyrics.set(uri, []);
                return [];
            }

            const pattern = /\[(\d+):(\d+).(\d+)\]\s*(.*)/;

            const lyrics = response.syncedLyrics.split("\n").flatMap((line) => {
                const match = line.match(pattern);

                if (match) {
                    const [, m, s, cs, lyrics] = match;

                    return [
                        {
                            lyrics,
                            timestamp:
                                10 *
                                (parseInt(cs) +
                                    100 * (parseInt(s) + 60 * parseInt(m))),
                        },
                    ];
                }

                return [];
            });

            this.#lyrics.set(uri, lyrics);
            return lyrics;
        } catch (e: unknown) {
            console.error("Failed to get lyrics");
            console.error(e);
        }
    }

    // @sort Book Keeping

    #base: Mopidy;

    constructor() {
        this.#base = new Mopidy({
            webSocketUrl: new URL("/mopidy/ws", WS_URL).toString(),
        });
    }

    init() {
        // Tracklist
        this.#base.on("event:tracklistChanged", () => {
            void this.#updateQueue();
        });
        this.#base.on("event:optionsChanged", () => {
            void this.#updateConsume();
            void this.#updateShuffle();
            void this.#updateRepeat();
            void this.#updateSingle();
        });

        // Playback
        this.#base.on("event:seeked", ({ time_position }) => {
            this.#timePosition = time_position;
        });
        this.#base.on("event:trackPlaybackStarted", ({ tl_track }) => {
            void this.#setCurrentTrack(model(tl_track));
            void this.#updatePreviousTrack();
            void this.#updateNextTrack();
            this.#timePosition = 0;
        });
        this.#base.on("event:trackPlaybackEnded", () => {
            this.#currentTrack = null;
            this.#timePosition = null;
        });
        this.#base.on("event:playbackStateChanged", ({ new_state }) => {
            this.#playbackState = new_state;
        });

        setInterval(() => {
            if (this.playbackState !== "playing") return;

            void this.#updateTimePosition();
        }, 100);

        // Library

        // Playlists

        // Mixer
        this.#base.on("event:muteChanged", ({ mute }) => {
            this.#mute = mute;
        });
        this.#base.on("event:volumeChanged", ({ volume }) => {
            this.#volume = volume;
        });

        // History

        // Images

        // Palette

        // Lyrics

        return new Promise<void>((resolve, reject) => {
            this.#base.on("state:online", () => {
                Promise.allSettled([
                    // Tracklist
                    this.#updateQueue(),
                    this.#updatePreviousTrack(),
                    this.#updateNextTrack(),
                    this.#updateConsume(),
                    this.#updateShuffle(),
                    this.#updateRepeat(),
                    this.#updateSingle(),

                    // Playback
                    this.#updateCurrentTrack(),
                    this.#updateTimePosition(),
                    this.#updatePlaybackState(),

                    // Library
                    this.#updateDirectory(null),

                    // Playlists
                    this.#updatePlaylists(),

                    // Mixer
                    this.#updateMute(),
                    this.#updateVolume(),

                    // History
                    this.#updateHistory(),
                ])
                    .then(() => {
                        resolve();
                    })
                    .catch((e: unknown) => {
                        console.error("Failed to initialize Mopidy");
                        console.error(e);
                        reject(
                            new Error("Failed to initialize Mopidy", {
                                cause: e,
                            }),
                        );
                    });
            });
        });
    }
}

export default MopidyState;
