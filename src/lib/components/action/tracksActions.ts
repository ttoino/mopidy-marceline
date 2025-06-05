import type MopidyState from "$lib/state/mopidy.svelte";
import type { Actions } from "$lib/types/action";
import type { AnyTracks } from "$lib/types/mopidy";

export default (mopidy: MopidyState, tracks: AnyTracks): Actions => [
    {
        action: () => mopidy.playNow(tracks),
        icon: "play_arrow",
        label: "Play",
    },
    {
        action: () => mopidy.playNext(tracks),
        icon: "resume",
        label: "Play Next",
    },
    {
        action: () => mopidy.addToQueue(tracks),
        icon: "add",
        label: "Add to Queue",
    },
    "divider",
    {
        actions: [
            ...mopidy.playlists.map((playlist) => ({
                action: () => mopidy.addToPlaylist(playlist, tracks),
                icon: "queue_music",
                label: playlist.name,
            })),
            {
                action: () => {
                    // TODO: Implement creating new playlist
                },
                icon: "add",
                label: "New playlist",
            },
        ],
        icon: "playlist_add",
        label: "Add to playlist",
    },
];
