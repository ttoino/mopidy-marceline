import type { ArtistURI, ModelRef } from "$lib/types/mopidy";

import { error } from "@sveltejs/kit";
import { sortByDate } from "$lib/sort";
import { brand } from "$lib/types/brand";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const { mopidy } = await parent();
    const uri: ArtistURI = brand(params.artist);

    try {
        const artist = await mopidy.getArtist(uri);

        const items = sortByDate([...artist.albums, ...artist.tracks]).map(
            (item) =>
                ({
                    name: item.name,
                    type: "album" in item ? "track" : "album",
                    uri: item.uri,
                }) as ModelRef,
        );

        const palette = mopidy.getPalette(uri);

        return {
            artist,
            items,
            palette,
        };
    } catch {
        throw error(404, "Artist not found");
    }
};
