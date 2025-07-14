import { error } from "@sveltejs/kit";
import { brand } from "$lib/types/brand";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const { mopidy } = await parent();

    const track = mopidy.getTrack(brand(params.track));

    if (!track) error(404, "Track not found");

    const lyrics = await mopidy.requestLyrics(track);

    const image = (await mopidy.requestImages([track.uri]))?.at(0);
    const palette = image ? await mopidy.requestPalette(image) : undefined;

    return {
        lyrics,
        palette,
        track,
    };
};
