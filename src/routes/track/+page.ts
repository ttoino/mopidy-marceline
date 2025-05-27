import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { mopidy } = await parent();

    const tracks = mopidy.tracks;

    await mopidy.requestImages(tracks.map((track) => track.uri));

    return {
        tracks,
    };
};
