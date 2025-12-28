import type { AlbumURI } from "$lib/types/mopidy";

import { error } from "@sveltejs/kit";
import { brand } from "$lib/types/brand";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const { mopidy } = await parent();
    const uri: AlbumURI = brand(params.album);

    try {
        const album = await mopidy.getAlbum(uri);

        const palette = mopidy.getPalette(uri);

        return {
            album,
            palette,
        };
    } catch {
        throw error(404, "Album not found");
    }
};
