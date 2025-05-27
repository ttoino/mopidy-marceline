import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { mopidy } = await parent();

    const albums = mopidy.albums;

    await mopidy.requestImages(albums.map((album) => album.uri));

    return {
        albums,
    };
};
