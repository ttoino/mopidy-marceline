import type Mopidy from "mopidy";

import type { Branded } from "./brand";
import type { Override } from "./util";

// @sort URIs

export type AlbumURI = Branded<string, "AlbumURI">;
export type ArtistURI = Branded<string, "ArtistURI">;
export type DirectoryURI = Branded<string, "DirectoryURI">;
export type ModelURI =
    | AlbumURI
    | ArtistURI
    | DirectoryURI
    | PlaylistURI
    | TrackURI;
export type PlaylistURI = Branded<string, "PlaylistURI">;
export type TlID = Branded<number, "TlID">;
export type TrackURI = Branded<string, "TrackURI">;

// @sort Refs

export type AlbumRef = Override<
    Mopidy.models.Ref<"album">,
    {
        uri: AlbumURI;
    }
>;

export type ArtistRef = Override<
    Mopidy.models.Ref<"artist">,
    {
        uri: ArtistURI;
    }
>;

export type DirectoryRef = Override<
    Mopidy.models.Ref<"directory">,
    {
        uri: DirectoryURI;
    }
>;

export type ModelRef =
    | AlbumRef
    | ArtistRef
    | DirectoryRef
    | PlaylistRef
    | TrackRef;

export type PlaylistRef = Override<
    Mopidy.models.Ref<"playlist">,
    {
        uri: PlaylistURI;
    }
>;

export type TrackRef = Override<
    Mopidy.models.Ref<"track">,
    {
        uri: TrackURI;
    }
>;

// @sort Models

export type Album = Override<
    Mopidy.models.Album,
    {
        artists: Artist[];
        uri: AlbumURI;
    }
>;

export type AlbumWithTracks = {
    tracks: Track[];
} & Album;

export type AnyTlTrack = TlID | TlTrack;

export type AnyTlTracks = TlID[] | TlTrack[];

export type AnyTrack = TlTrack | Track | TrackRef | TrackURI;

export type AnyTracks = TlTrack[] | Track[] | TrackRef[] | TrackURI[];

export type Artist = Override<
    Mopidy.models.Artist,
    {
        uri: ArtistURI;
    }
>;

export type ArtistWithAlbums = {
    albums: Album[];
} & Artist;

export type Directory = {
    children: ModelRef[];
    name?: string;
    uri: DirectoryURI | null;
};

export type HistoryEntry = {
    timestamp: Date;
    track: TrackRef;
};

export type PlaybackState = Mopidy.core.PlaybackState;

export type Playlist = Override<
    Mopidy.models.Playlist,
    {
        tracks: Track[];
        uri: PlaylistURI;
    }
>;

export type TlTrack = Override<
    Mopidy.models.TlTrack,
    {
        tlid: TlID;
        track: Track;
    }
>;

export type Track = Override<
    Mopidy.models.Track,
    {
        album: Album;
        artists: Artist[];
        composers: Artist[];
        performers: Artist[];
        uri: TrackURI;
    }
>;

export type TrackLyrics = {
    lyrics: string;
    timestamp: number;
}[];

export function model(ref: Mopidy.models.Ref<"album">): AlbumRef;
export function model(ref: Mopidy.models.Ref<"artist">): ArtistRef;
export function model(ref: Mopidy.models.Ref<"directory">): DirectoryRef;
export function model(ref: Mopidy.models.Ref<"playlist">): PlaylistRef;
export function model(ref: Mopidy.models.Ref<"track">): TrackRef;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function model(ref: Mopidy.models.Ref<any>): ModelRef;
export function model(album: Mopidy.models.Album): Album;
export function model(artist: Mopidy.models.Artist): Artist;
export function model(playlist: Mopidy.models.Playlist): Playlist;
export function model(track: Mopidy.models.Track): Track;
export function model(tlTrack: Mopidy.models.TlTrack): TlTrack;

export function model(
    model:
        | Mopidy.models.Album
        | Mopidy.models.Artist
        | Mopidy.models.Playlist
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | Mopidy.models.Ref<any>
        | Mopidy.models.TlTrack
        | Mopidy.models.Track,
) {
    return model;
}

export function models(refs: Mopidy.models.Ref<"album">[]): AlbumRef[];
export function models(refs: Mopidy.models.Ref<"artist">[]): ArtistRef[];
export function models(refs: Mopidy.models.Ref<"directory">[]): DirectoryRef[];
export function models(refs: Mopidy.models.Ref<"playlist">[]): PlaylistRef[];
export function models(refs: Mopidy.models.Ref<"track">[]): TrackRef[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function models(refs: Mopidy.models.Ref<any>[]): ModelRef[];
export function models(albums: Mopidy.models.Album[]): Album[];
export function models(artists: Mopidy.models.Artist[]): Artist[];
export function models(playlists: Mopidy.models.Playlist[]): Playlist[];
export function models(tracks: Mopidy.models.Track[]): Track[];
export function models(tlTracks: Mopidy.models.TlTrack[]): TlTrack[];

export function models(
    models:
        | Mopidy.models.Album[]
        | Mopidy.models.Artist[]
        | Mopidy.models.Playlist[]
        | Mopidy.models.Ref<"album">[]
        | Mopidy.models.Ref<"artist">[]
        | Mopidy.models.Ref<"directory">[]
        | Mopidy.models.Ref<"playlist">[]
        | Mopidy.models.Ref<"track">[]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | Mopidy.models.Ref<any>[]
        | Mopidy.models.TlTrack[]
        | Mopidy.models.Track[],
) {
    return models;
}
