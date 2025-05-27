import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { mopidy } = await parent();

    const history = mopidy.history;

    await mopidy.requestImages(history.map((item) => item.track.uri));

    return {
        history,
    };
};
