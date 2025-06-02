import type MopidyState from "$lib/state/mopidy.svelte";
import type { Actions } from "$lib/types/action";
import type { AnyTrack, AnyTracks } from "$lib/types/mopidy";

import tracksActions from "./tracksActions";

export default (mopidy: MopidyState, track: AnyTrack): Actions =>
    tracksActions(mopidy, [track] as AnyTracks);
