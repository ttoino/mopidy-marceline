<script lang="ts">
    import type { PlaylistRef } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { Icon } from "svelte-m3c";

    import playlistActions from "../action/playlistActions";
    import PlaylistLink from "../link/PlaylistLink.svelte";
    import ListItem from "./ListItem.svelte";

    let {
        playlist: ref,
    }: {
        playlist: PlaylistRef;
    } = $props();

    const mopidy = getMopidy();

    let playlist = $derived(mopidy.getPlaylist(ref.uri));

    let actions = $derived(playlistActions(mopidy, playlist));
</script>

<ListItem {actions} lines={1}>
    {#snippet leading()}
        {@const image = await mopidy.getMainImage(ref.uri)}

        {#if image}
            <img
                class="aspect-square h-full object-cover"
                alt="Album cover"
                src={image}
            />
        {:else}
            <Icon icon="queue_music" />
        {/if}
    {/snippet}
    {#snippet labelText()}
        <PlaylistLink contained={false} {playlist} />
    {/snippet}
    {#snippet trailing()}
        {playlist.tracks.length} tracks
    {/snippet}
</ListItem>
