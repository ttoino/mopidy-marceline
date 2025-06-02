import type MopidyState from "$lib/state/mopidy.svelte";
import type { Actions } from "$lib/types/action";
import type { TlTrack } from "$lib/types/mopidy";

import trackActions from "./trackActions";

export default (mopidy: MopidyState, tlTrack: TlTrack): Actions => [
    {
        action: () => mopidy.removeFromQueue(tlTrack),
        icon: "close",
        label: "Remove from Queue",
    },
    ...trackActions(mopidy, tlTrack),
];
