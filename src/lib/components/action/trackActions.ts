import type MopidyState from "$lib/state/mopidy.svelte";
import type { Actions } from "$lib/types/action";
import type { AnyTracks, Track } from "$lib/types/mopidy";

import { goto } from "$app/navigation";
import { base } from "$app/paths";

import tracksActions from "./tracksActions";

export default (mopidy: MopidyState, track: Track): Actions => [
    ...tracksActions(mopidy, [track] as AnyTracks),
    "divider",
    {
        action: () => goto(`${base}/track/${encodeURIComponent(track.uri)}`),
        icon: "music_note",
        label: "Go to track",
    },
    {
        action: () =>
            goto(`${base}/artist/${encodeURIComponent(track.artists[0].uri)}`),
        icon: "artist",
        label: "Go to artist",
    },
    {
        action: () =>
            goto(`${base}/album/${encodeURIComponent(track.album.uri)}`),
        icon: "album",
        label: "Go to album",
    },
];
