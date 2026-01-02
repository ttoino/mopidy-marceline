import type { PlaylistURI } from "$lib/types/mopidy";

import { error } from "@sveltejs/kit";
import { brand } from "$lib/types/brand";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const { mopidy } = await parent();
    const uri: PlaylistURI = brand(params.playlist);

    try {
        const playlist = await mopidy.getPlaylist(brand(params.playlist));

        const palette = mopidy.getPalette(uri);

        return {
            palette,
            playlist,
        };
    } catch {
        throw error(404, "Playlist not found");
    }
};
