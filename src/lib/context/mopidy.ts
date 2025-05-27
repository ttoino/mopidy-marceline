import type MopidyState from "$lib/state/mopidy.svelte";

import { getContext, setContext } from "svelte";

export const MOPIDY = "mopidy";

export const setMopidy = (mopidy: MopidyState) => setContext(MOPIDY, mopidy);

export const getMopidy = () => {
    const mopidy = getContext<MopidyState>(MOPIDY);

    if (!mopidy) throw new Error("Mopidy context not found");

    return mopidy;
};
