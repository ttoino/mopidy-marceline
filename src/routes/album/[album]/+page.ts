import { error } from "@sveltejs/kit";
import { brand } from "$lib/types/brand";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const { mopidy } = await parent();

    const album = mopidy.getAlbum(brand(params.album));

    if (!album) error(404, "Album not found");

    const image = (
        await mopidy.requestImages([
            album.uri,
            ...album.tracks.map((track) => track.uri),
        ])
    )?.at(0);
    const palette = image ? await mopidy.requestPalette(image) : undefined;

    return {
        album,
        palette,
    };
};
