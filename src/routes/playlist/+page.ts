import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { mopidy } = await parent();

    const playlists = await mopidy.playlists;

    return {
        playlists,
    };
};
