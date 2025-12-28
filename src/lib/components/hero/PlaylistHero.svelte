<script lang="ts">
    import type { Playlist } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { formatDateRelative, formatDuration } from "$lib/format";

    import playlistActions from "../action/playlistActions";
    import PlaylistLink from "../link/PlaylistLink.svelte";
    import Hero from "./Hero.svelte";
    import InfoChip from "./InfoChip.svelte";

    let {
        playlist,
    }: {
        playlist: Playlist;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getMainImage(playlist.uri));

    let actions = $derived(playlistActions(mopidy, playlist));
</script>

<Hero {actions} {image}>
    {#snippet title()}
        <PlaylistLink {playlist} />
    {/snippet}

    {#snippet subtitle()}
        {playlist.tracks.length} track{playlist.tracks.length > 1 ? "s" : ""}
    {/snippet}

    {#snippet info()}
        <InfoChip icon="calendar_today" tooltip="Last modified">
            {formatDateRelative(new Date(playlist.last_modified))}
        </InfoChip>
        <!-- <InfoChip icon="timer" tooltip="Duration">
            {formatDuration(
                playlist.tracks.reduce(
                    (total, track) => total + track.length,
                    0,
                ),
            )}
        </InfoChip> -->
    {/snippet}
</Hero>
