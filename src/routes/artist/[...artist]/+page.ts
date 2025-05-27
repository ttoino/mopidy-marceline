import { error } from "@sveltejs/kit";
import { brand } from "$lib/types/brand";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const { mopidy } = await parent();

    const artist = mopidy.getArtist(brand(params.artist));

    if (!artist) error(404, "Artist not found");

    const image = (await mopidy.requestImages([artist.uri]))?.at(0);
    const palette = image ? await mopidy.requestPalette(image) : undefined;

    return {
        artist,
        palette,
    };
};
