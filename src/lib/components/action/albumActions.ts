import type MopidyState from "$lib/state/mopidy.svelte";
import type { Actions } from "$lib/types/action";
import type { AlbumWithTracks } from "$lib/types/mopidy";

import { goto } from "$app/navigation";
import { resolve } from "$lib/navigation";

import tracksActions from "./tracksActions";

export default (mopidy: MopidyState, album: AlbumWithTracks): Actions => [
    ...tracksActions(mopidy, album.tracks),
    "divider",
    {
        action: () =>
            goto(
                resolve("/artist/[artist]", {
                    artist: album.artists[0].uri,
                }),
            ),
        icon: "artist",
        label: "Go to artist",
    },
    {
        action: () =>
            goto(
                resolve("/album/[album]", {
                    album: album.uri,
                }),
            ),
        icon: "album",
        label: "Go to album",
    },
];
