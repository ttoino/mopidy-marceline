import type MopidyState from "$lib/state/mopidy.svelte";
import type { Actions } from "$lib/types/action";
import type { AnyTracks, Track } from "$lib/types/mopidy";

import { goto } from "$app/navigation";
import { resolve } from "$lib/navigation";

import tracksActions from "./tracksActions";

export default (mopidy: MopidyState, track: Track): Actions => [
    ...tracksActions(mopidy, [track] as AnyTracks),
    "divider",
    {
        action: () =>
            goto(
                resolve("/track/[track]", {
                    track: track.uri,
                }),
            ),
        icon: "music_note",
        label: "Go to track",
    },
    {
        action: () =>
            goto(
                resolve("/artist/[artist]", {
                    artist: track.artists[0].uri,
                }),
            ),
        icon: "artist",
        label: "Go to artist",
    },
    {
        action: () =>
            goto(
                resolve("/album/[album]", {
                    album: track.album.uri,
                }),
            ),
        icon: "album",
        label: "Go to album",
    },
];
