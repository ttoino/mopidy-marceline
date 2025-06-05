import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { mopidy } = await parent();

    const playlists = mopidy.playlists;

    return {
        playlists,
    };
};
