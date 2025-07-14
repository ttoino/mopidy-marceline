import type MopidyState from "$lib/state/mopidy.svelte";
import type { Actions } from "$lib/types/action";
import type { TlTrack } from "$lib/types/mopidy";

import tracksActions from "./tracksActions";

export default (mopidy: MopidyState, tlTracks: TlTrack[]): Actions => [
    {
        action: () => mopidy.removeFromQueue(tlTracks),
        icon: "close",
        label: "Remove from Queue",
    },
    "divider",
    ...tracksActions(mopidy, tlTracks),
];
