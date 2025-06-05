import { error } from "@sveltejs/kit";
import { brand } from "$lib/types/brand";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const { mopidy } = await parent();

    const playlist = mopidy.getPlaylist(brand(params.playlist));

    if (!playlist) error(404, "Playlist not found");

    const image = (
        await mopidy.requestImages([
            playlist.uri,
            ...playlist.tracks.map((track) => track.uri),
        ])
    )?.at(0);
    const palette = image ? await mopidy.requestPalette(image) : undefined;

    return {
        palette,
        playlist,
    };
};
