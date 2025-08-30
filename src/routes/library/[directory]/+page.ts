import type { DirectoryURI } from "$lib/types/mopidy";

import { error } from "@sveltejs/kit";
import { brand } from "$lib/types/brand";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const { mopidy } = await parent();

    const directoryURI: DirectoryURI | null =
        params.directory === "" ? null : brand(params.directory);

    const directory = mopidy.getDirectory(directoryURI);

    if (!directory) throw error(404, "Directory not found");

    await mopidy.requestImages(directory.children.map((ref) => ref.uri));

    return {
        directory,
    };
};
