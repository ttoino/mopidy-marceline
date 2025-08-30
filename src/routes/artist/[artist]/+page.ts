import { error } from "@sveltejs/kit";
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

    const image = (
        await mopidy.requestImages([
            artist.uri,
            ...tracks.map((track) => track.uri),
        ])
    )?.at(0);
    const palette = image ? await mopidy.requestPalette(image) : undefined;

    return {
        artist,
        palette,
        tracks,
    };
};
