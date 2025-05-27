import type { LRCLibResponse } from "./types/lrclib";

export const get = async (args: {
    albumName?: string;
    artistName: string;
    duration?: number;
    trackName: string;
}) => {
    const params = new URLSearchParams({
        album_name: args.albumName ?? "",
        artist_name: args.artistName,
        duration: args.duration?.toString() || "",
        track_name: args.trackName,
    });

    const response = await fetch(`https://lrclib.net/api/get?${params}`);

    if (!response.ok) throw new Error("Failed to fetch lyrics");

    return (await response.json()) as LRCLibResponse;
};
