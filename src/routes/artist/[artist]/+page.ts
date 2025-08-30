import type { ModelRef } from "$lib/types/mopidy";

import { error } from "@sveltejs/kit";
import { sortByDate } from "$lib/sort";
import { brand } from "$lib/types/brand";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const { mopidy } = await parent();

    const artist = mopidy.getArtist(brand(params.artist));

    if (!artist) error(404, "Artist not found");

    const tracks = mopidy.tracks.filter(
        (track) =>
            !track.album.artists.some((a) => a.uri === artist.uri) &&
            [
                ...(track.artists ?? []),
                ...(track.composers ?? []),
                ...(track.performers ?? []),
            ].some((a) => a.uri === artist.uri),
    );

    const items = sortByDate([...artist.albums, ...tracks]).map(
        (item) =>
            ({
                name: item.name,
                type: "album" in item ? "track" : "album",
                uri: item.uri,
            }) as ModelRef,
    );

    const image = (
        await mopidy.requestImages([
            artist.uri,
            ...tracks.map((track) => track.uri),
        ])
    )?.at(0);
    const palette = image ? await mopidy.requestPalette(image) : undefined;

    return {
        artist,
        items,
        palette,
    };
};
