import type { MopidyState } from "$lib/state/mopidy.svelte";
import type { Actions } from "$lib/types/action";
import type { ArtistWithAlbumsAndTracks } from "$lib/types/mopidy";

import { goto } from "$app/navigation";
import { resolve } from "$lib/navigation";

import tracksActions from "./tracksActions";

export default (
    mopidy: MopidyState,
    artist: ArtistWithAlbumsAndTracks,
): Actions => [
    ...tracksActions(mopidy, artist.tracks),
    "divider",
    {
        action: () =>
            goto(
                resolve("/artist/[artist]", {
                    artist: artist.uri,
                }),
            ),
        icon: "artist",
        label: "Go to artist",
    },
];
