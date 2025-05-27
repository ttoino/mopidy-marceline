import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { mopidy } = await parent();

    const artists = mopidy.artists;

    await mopidy.requestImages(artists.map((artist) => artist.uri));

    return {
        artists,
    };
};
