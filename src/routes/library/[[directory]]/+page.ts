import type { DirectoryURI } from "$lib/types/mopidy";

import { error } from "@sveltejs/kit";
import { brand } from "$lib/types/brand";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
    const { mopidy } = await parent();
    const uri: DirectoryURI | null = brand(params?.directory) ?? null;

    try {
        const directory = await mopidy.getDirectory(uri);

        const palette = uri ? mopidy.getPalette(uri) : null;

        return {
            directory,
            palette,
        };
    } catch {
        throw error(404, "Directory not found");
    }
};
