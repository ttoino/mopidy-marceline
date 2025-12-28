import { mopidy as mopidyFn } from "$lib/state/mopidy.svelte";

import type { LayoutLoad } from "./$types";

export const ssr = false;

export const load: LayoutLoad = async () => {
    const mopidy = await mopidyFn();

    return {
        mopidy,
    };
};
