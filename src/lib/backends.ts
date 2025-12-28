export const libraryUris = {
    album: {
        gmusic: "gmusic:album",
        jellyfin: "jellyfin:albums",
        local: "local:directory?type=album",
        spotify: "spotify:library:albums",
        subidy: "subidy:vdir:albums",
        tidal: "tidal:my_albums",
        ytmusic: "ytmusic:album",
    },
    artist: {
        gmusic: "gmusic:artist",
        jellyfin: "jellyfin:artists",
        local: "local:directory?type=artist",
        spotify: "spotify:library:artists",
        subidy: "subidy:vdir:artists",
        tidal: "tidal:my_artists",
        ytmusic: "ytmusic:artist",
    },
    track: {
        local: "local:directory?type=track",
        spotify: "spotify:library:tracks",
        tidal: "tidal:my_tracks",
    },
};
