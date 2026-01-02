import { libraryUris } from "$lib/backends";
import { BASE_URL, WS_URL } from "$lib/constants";
import * as lrclib from "$lib/lrclib";
import { brand } from "$lib/types/brand";
import {
    type Album,
    type AlbumRef,
    type AlbumURI,
    type AlbumWithTracks,
    type AnyTlTrack,
    type AnyTlTracks,
    type AnyTrack,
    type AnyTracks,
    type ArtistRef,
    type ArtistURI,
    type ArtistWithAlbumsAndTracks,
    type Directory,
    type DirectoryURI,
    type HistoryEntry,
    model,
    models,
    type ModelURI,
    type PlaybackState,
    type Playlist,
    type PlaylistRef,
    type PlaylistURI,
    type TlID,
    type TlTrack,
    type Track,
    type TrackLyrics,
    type TrackRef,
    type TrackURI,
} from "$lib/types/mopidy";
import Mopidy from "mopidy";
import { cssPaletteFromImage } from "svelte-m3c/palette";
import { SvelteMap } from "svelte/reactivity";

const normalizeTrackURIs = (tracks: AnyTrack | AnyTracks = []) => {
    const trackArray = Array.isArray(tracks) ? tracks : ([tracks] as AnyTracks);

    if (trackArray.length < 1) return [];

    if (typeof trackArray[0] === "string") return trackArray as TrackURI[];

    if ("uri" in trackArray[0])
        return (trackArray as Track[] | TrackRef[]).map((t) => t.uri);

    return (trackArray as TlTrack[]).map((t) => t.track.uri);
};

const normalizeTlIDs = (tracks: AnyTlTrack | AnyTlTracks = []) => {
    const trackArray = Array.isArray(tracks)
        ? tracks
        : ([tracks] as AnyTlTracks);

    if (trackArray.length < 1) return [];

    if (typeof trackArray[0] === "number") return trackArray as TlID[];

    return (trackArray as TlTrack[]).map((t) => t.tlid);
};

const historyState = (base: Mopidy, history: Mopidy.core.HistoryController) => {
    const state: HistoryEntry[] = $state([]);

    const update = async () => {
        const allItems = (await history.getHistory()) as unknown as [
            number,
            TrackRef,
        ][];

        const mostRecent = state.at(0)?.timestamp ?? new Date(0);
        const newItems =
            state.length > 0
                ? allItems.slice(
                      0,
                      allItems.findIndex(
                          ([time]) => time <= mostRecent.getTime(),
                      ),
                  )
                : allItems;

        state.unshift(
            ...newItems.map(([date, track]) => ({
                timestamp: new Date(date),
                track,
            })),
        );

        console.debug(`Added ${newItems.length} items to the history`);
    };

    base.on("event:trackPlaybackStarted", () => void update());
    void update();

    return {
        history: () => state,
    };
};

const libraryState = (
    backends: Promise<string[]>,
    library: Mopidy.core.LibraryController,
) => {
    const requestTracksAt = async (uri: ModelURI) =>
        models(
            (
                await library.lookup({
                    uris: [uri],
                })
            )[uri],
        );

    const getOrRequest = <K, V>(request: (k: K) => Promise<V>) => {
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        const cache = new Map<K, Promise<V>>();

        return (k: K) => {
            let value = cache.get(k);

            if (value === undefined) {
                value = request(k);
                cache.set(k, value);
            }

            return value;
        };
    };

    const requestAlbum = async (uri: AlbumURI) => {
        const tracks = await requestTracksAt(uri);
        const album = tracks.at(0)?.album;

        if (!album) throw new Error(`Album ${uri} not found`);

        return {
            ...album,
            tracks,
        } satisfies AlbumWithTracks;
    };

    const requestArtist = async (uri: ArtistURI) => {
        const fetchedTracks = await requestTracksAt(uri);
        const artist = fetchedTracks
            .flatMap((track) => track.artists)
            .find((artist) => artist.uri === uri);

        if (!artist) throw new Error(`Artist ${uri} not found`);

        const albums: Album[] = [];
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        const albumIds = new Set<AlbumURI>();
        const tracks: Track[] = [];

        for (const track of fetchedTracks) {
            if (albumIds.has(track.album.uri)) continue;

            if (track.album.artists.some((a) => a.uri === uri)) {
                albums.push(track.album);
                albumIds.add(track.album.uri);
                continue;
            }

            tracks.push(track);
        }

        return {
            ...artist,
            albums,
            tracks,
        } satisfies ArtistWithAlbumsAndTracks;
    };

    const requestDirectory = async (
        uri: DirectoryURI | null,
        name?: string,
    ) => {
        const children = models(
            await library.browse({
                // @ts-expect-error: It should accept null
                uri,
            }),
        );

        return {
            children,
            name,
            uri,
        } satisfies Directory;
    };

    const requestImages = async (uri: ModelURI) =>
        (
            await library.getImages({
                uris: [uri],
            })
        )[uri].map((image) => new URL(image.uri, BASE_URL).toString());

    const requestTrack = async (uri: TrackURI) => {
        const tracks = await requestTracksAt(uri);

        if (tracks.length !== 1) throw new Error(`Track ${uri} not found`);

        return tracks[0];
    };

    const getAlbum = getOrRequest(requestAlbum);
    const getArtist = getOrRequest(requestArtist);
    const getDirectory = getOrRequest(requestDirectory);
    const getImages = getOrRequest(requestImages);
    const getTrack = getOrRequest(requestTrack);

    const getMainImage = async (uri: ModelURI) =>
        (await getImages(uri)).at(0) ?? null;

    const requestLyrics = async (uri: TrackURI) => {
        const track = await getTrack(uri);

        const response = await lrclib.get({
            albumName: track.album.name,
            artistName: track.artists.map((a) => a.name).join(", "),
            duration: Math.round(track.length / 1000),
            trackName: track.name,
        });

        const lyrics: TrackLyrics = {
            plain: [],
            timed: [],
        };

        if (response.plainLyrics) {
            lyrics.plain = response.plainLyrics
                .split(/\n\n+/)
                .map((line) => line.split(/\n/));
        }

        if (response.syncedLyrics) {
            const pattern = /\[(\d+):(\d+).(\d+)\]\s*(.*)/;

            for (const line of response.syncedLyrics.split("\n")) {
                const match = line.match(pattern);

                if (match) {
                    const [, m, s, cs, lyricsLine] = match;

                    lyrics.timed.push({
                        text: lyricsLine,
                        timestamp:
                            10 *
                            (parseInt(cs) +
                                100 * (parseInt(s) + 60 * parseInt(m))),
                    });
                }
            }
        }

        return lyrics;
    };

    const requestPalette = async (uri: ModelURI) => {
        const image = await getMainImage(uri);

        return image ? cssPaletteFromImage(image) : null;
    };

    const getLyrics = getOrRequest(requestLyrics);
    const getPalette = getOrRequest(requestPalette);

    const allOfType = <T extends keyof typeof libraryUris>(type: T) =>
        backends.then(async (backends) => {
            const models: {
                album: AlbumRef;
                artist: ArtistRef;
                track: TrackRef;
            }[T][] = [];
            const uris = libraryUris[type];

            for (const backend of backends) {
                if (!(backend in uris)) continue;

                const uri = uris[backend as keyof typeof uris];

                const directory = await getDirectory(brand(uri));

                for (const child of directory.children) {
                    if (child.type !== type) continue;

                    models.push(
                        child as {
                            album: AlbumRef;
                            artist: ArtistRef;
                            track: TrackRef;
                        }[T],
                    );
                }
            }

            return models;
        });

    const albums = allOfType("album");
    const artists = allOfType("artist");
    const tracks = allOfType("track");

    return {
        albums,
        artists,
        getAlbum,
        getArtist,
        getDirectory,
        getImages,
        getLyrics,
        getMainImage,
        getPalette,
        getTrack,
        tracks,
    };
};

const mixerState = (base: Mopidy, mixer: Mopidy.core.MixerController) => {
    let muteState = $state(false);
    let volumeState = $state(100);

    base.on("event:muteChanged", ({ mute }) => {
        muteState = mute;

        console.debug("Mute changed");
    });
    mixer.getMute().then((mute) => {
        if (mute != null) muteState = mute;

        console.debug("Mute changed");
    });

    base.on("event:volumeChanged", ({ volume }) => {
        volumeState = volume;

        console.debug("Volume changed");
    });
    mixer.getVolume().then((volume) => {
        if (volume != null) volumeState = volume;

        console.debug("Volume changed");
    });

    return {
        mute: () => muteState,

        setMute: (mute: boolean) => {
            void mixer.setMute({ mute });
            muteState = mute;
        },

        setVolume: (volume: number) => {
            void mixer.setVolume({ volume });
            volumeState = volume;
        },

        volume: () => volumeState,
    };
};

const playbackState = (
    base: Mopidy,
    playback: Mopidy.core.PlaybackController,
    tracklist: Mopidy.core.TracklistController,
) => {
    let currentTrack = $state<null | TlTrack>(null);

    let playbackState = $state<PlaybackState>("stopped");
    let timePosition = $state<null | number>(null);

    let consume = $state(false);
    let repeat = $state(false);
    let shuffle = $state(false);
    let single = $state(false);

    const updateOptions = async () => {
        [consume, repeat, shuffle, single] = await Promise.all([
            tracklist.getConsume(),
            tracklist.getRepeat(),
            tracklist.getRandom(),
            tracklist.getSingle(),
        ]);

        console.debug("Updated consume, repeat, shuffle, and single");
    };

    void (async () => {
        const tlTrack = await playback.getCurrentTlTrack();
        if (tlTrack) currentTrack = model(tlTrack);

        console.debug("Updated current track");
    })();
    void updateOptions();

    base.on("event:seeked", ({ time_position }) => {
        timePosition = time_position;

        console.debug("User seeked");
    });
    base.on("event:trackPlaybackStarted", ({ tl_track }) => {
        currentTrack = model(tl_track);
        timePosition = 0;

        console.debug("Playback started");
    });
    base.on("event:trackPlaybackEnded", () => {
        currentTrack = null;
        timePosition = null;

        console.debug("Playback ended");
    });
    base.on("event:playbackStateChanged", ({ new_state }) => {
        playbackState = new_state;

        console.debug("Changed playback state");
    });
    base.on("event:optionsChanged", () => void updateOptions());

    setInterval(() => {
        if (playbackState !== "playing" || timePosition === null) return;

        timePosition += 100;

        console.debug("Seeked implicitly");
    }, 100);

    setInterval(async () => {
        if (playbackState !== "playing") return;

        timePosition = await playback.getTimePosition();

        console.debug("Synced time position with server");
    }, 10000);

    return {
        consume: () => consume,

        currentTrack: () => currentTrack,

        playbackState: () => playbackState,

        repeat: () => repeat,

        setConsume: (value: boolean) => {
            consume = value;
            void tracklist.setConsume({ value });
        },

        setPlaybackState: (newState: PlaybackState) => {
            switch (newState) {
                case "paused":
                    void playback.pause();
                    break;
                case "playing":
                    void playback.resume();
                    break;
                case "stopped":
                    void playback.stop();
                    break;
                default:
                    throw new Error(`Unknown playback state ${newState}`);
            }

            playbackState = newState;
        },

        setRepeat: (value: boolean) => {
            repeat = value;
            void tracklist.setRepeat({ value });
        },

        setShuffle: (value: boolean) => {
            shuffle = value;
            void tracklist.setRandom({ value });
        },

        setSingle: (value: boolean) => {
            single = value;
            void tracklist.setSingle({ value });
        },

        setTimePosition: (newTime: number) => {
            timePosition = newTime;
            void playback.seek({ time_position: newTime });
        },

        shuffle: () => shuffle,

        single: () => single,

        skipNext() {
            void playback.next();
        },

        skipPrevious() {
            void playback.previous();
        },

        timePosition: () => timePosition,

        togglePlaybackState() {
            switch (playbackState) {
                case "paused":
                    this.setPlaybackState("playing");
                    break;
                case "playing":
                    this.setPlaybackState("paused");
                    break;
                case "stopped":
                    break;
                default:
                    throw new Error(`Unknown playback state ${playbackState}`);
            }
        },
    };
};

const playlistsState = (
    base: Mopidy,
    playlists: Mopidy.core.PlaylistsController,
) => {
    const state = new SvelteMap<PlaylistURI, Playlist>();

    const normalizePlaylist = (playlist: Mopidy.models.Playlist): Playlist => ({
        ...model(playlist),
        tracks: model(playlist).tracks.map(({ name, uri }) => ({
            name,
            type: "track",
            uri,
        })),
    });

    const loaded = playlists.asList().then((refs) =>
        Promise.allSettled(
            refs.map(async (ref) => {
                const playlist = await playlists.lookup({ uri: ref.uri });

                if (!playlist) throw new Error("Playlist not found");

                console.debug("Found a playlist");

                const playlistModel = normalizePlaylist(playlist);

                state.set(playlistModel.uri, playlistModel);

                console.debug(`There are ${state.size} playlists`);
            }),
        ),
    );

    base.on("event:playlistDeleted", ({ uri }) => {
        state.delete(brand(uri));

        console.debug("A playlist was deleted");
    });

    base.on("event:playlistChanged", ({ playlist }) => {
        const pl = normalizePlaylist(playlist);
        state.set(pl.uri, pl);

        console.debug("A playlist changed");
    });

    const getPlaylist = async (uri: PlaylistURI) => {
        await loaded;

        const playlist = state.get(uri);

        if (!playlist) throw new Error("Playlist not found");

        return playlist;
    };

    return {
        addToPlaylist: async (
            playlist: Playlist | PlaylistRef | PlaylistURI,
            tracks: AnyTrack | AnyTracks,
        ) => {
            const uri = typeof playlist !== "string" ? playlist.uri : playlist;
            const pl = await getPlaylist(uri);

            const newPlaylist = await playlists.save({
                playlist: {
                    ...pl,
                    // @ts-expect-error: We just need the uri
                    tracks: [
                        ...pl.tracks.map(({ name, uri }) => ({ name, uri })),
                        ...normalizeTrackURIs(tracks).map((uri) => ({
                            uri,
                        })),
                    ],
                },
            });

            if (!newPlaylist) return;

            const newPlaylistModel = model(newPlaylist);
            state.set(newPlaylistModel.uri, newPlaylistModel);
        },

        deletePlaylist: async (
            playlist: Playlist | PlaylistRef | PlaylistURI,
        ) => {
            const uri =
                typeof playlist === "string"
                    ? playlist
                    : (playlist as Playlist).uri;

            state.delete(uri);

            await playlists.delete({ uri });
        },

        getPlaylist,

        playlists: () => state.values().toArray(),
    };
};

const tracklistState = (
    base: Mopidy,
    playback: Mopidy.core.PlaybackController,
    tracklist: Mopidy.core.TracklistController,
) => {
    let queue: TlTrack[] = $state([]);
    let previousTrack: null | TlTrack = $state(null);
    let nextTrack: null | TlTrack = $state(null);

    const update = async () => {
        queue = models(await tracklist.getTlTracks());

        const previousTrackId = await tracklist.getPreviousTlid();
        previousTrack =
            previousTrackId !== null
                ? (queue.find(({ tlid }) => tlid === previousTrackId) ?? null)
                : null;

        const nextTrackId = await tracklist.getNextTlid();
        nextTrack =
            nextTrackId !== null
                ? (queue.find(({ tlid }) => tlid === nextTrackId) ?? null)
                : null;

        console.debug("Updated queue");
    };

    void update();
    base.on("event:trackPlaybackStarted", () => void update());
    base.on("event:trackPlaybackEnded", () => void update());

    return {
        addToQueue: async (tracks: AnyTrack | AnyTracks) =>
            await tracklist.add({
                uris: normalizeTrackURIs(tracks),
            }),

        clearQueue: async () => await tracklist.clear(),

        nextTrack: () => nextTrack,

        playNext: async (tracks: AnyTrack | AnyTracks) => {
            await tracklist.add({
                at_position: 1,
                uris: normalizeTrackURIs(tracks),
            });
            await playback.play({});
        },

        playNow: async (tracks: AnyTrack | AnyTracks) => {
            await tracklist.clear();
            await tracklist.add({
                uris: normalizeTrackURIs(tracks),
            });
            await playback.play({});
        },

        previousTrack: () => previousTrack,

        queue: () => queue,

        removeFromQueue: async (tracks: AnyTlTrack | AnyTlTracks) =>
            await tracklist.remove({
                criteria: {
                    // @ts-expect-error: Types are wrong
                    tlid: normalizeTlIDs(tracks),
                },
            }),

        shuffleQueue: async () => await tracklist.shuffle({}),

        skipToTrack: async (track: AnyTlTrack) => {
            const tlid = normalizeTlIDs(track);

            if (tlid.length !== 1) return;

            await playback.play({
                tlid: tlid[0],
            });
        },
    };
};

export const mopidy = async () => {
    const base = new Mopidy({
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        webSocketUrl: new URL("/mopidy/ws", WS_URL).toString(),
    });

    await new Promise<void>((resolve) => {
        base.on("state:online", () => {
            resolve();
        });
    });

    const backends = base.getUriSchemes();

    const { history, library, mixer, playback, playlists, tracklist } = base;

    if (!history || !library || !mixer || !playback || !playlists || !tracklist)
        throw new Error("Mopidy instance is missing required extensions");

    return {
        backends,
        ...historyState(base, history),
        ...libraryState(backends, library),
        ...mixerState(base, mixer),
        ...playbackState(base, playback, tracklist),
        ...playlistsState(base, playlists),
        ...tracklistState(base, playback, tracklist),
    };
};

export type MopidyState = Awaited<ReturnType<typeof mopidy>>;
