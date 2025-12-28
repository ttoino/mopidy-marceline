import type { TrackURI } from "$lib/types/mopidy";

import { error } from "@sveltejs/kit";
import { brand } from "$lib/types/brand";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const { mopidy } = await parent();
    const uri: TrackURI = brand(params.track);

    try {
        const track = await mopidy.getTrack(uri);

        const palette = mopidy.getPalette(uri);

        return {
            palette,
            track,
        };
    } catch {
        throw error(404, "Track not found");
    }
};
