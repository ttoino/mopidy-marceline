import type MopidyState from "$lib/state/mopidy.svelte";
import type { Actions } from "$lib/types/action";
import type { Playlist } from "$lib/types/mopidy";

import tracksActions from "./tracksActions";

export default (mopidy: MopidyState, playlist: Playlist): Actions => [
    ...tracksActions(mopidy, playlist.tracks),
    "divider",
    {
        action: () => mopidy.deletePlaylist(playlist),
        icon: "delete",
        label: "Delete",
    },
];
