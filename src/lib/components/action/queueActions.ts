import type MopidyState from "$lib/state/mopidy.svelte";
import type { Actions } from "$lib/types/action";

export default (mopidy: MopidyState): Actions => [
    {
        action: () => mopidy.clearQueue(),
        icon: "close",
        label: "Clear",
    },
    {
        action: () => mopidy.shuffleQueue(),
        icon: "shuffle",
        label: "Shuffle",
    },
];
