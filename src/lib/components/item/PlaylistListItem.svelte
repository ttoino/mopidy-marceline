<script lang="ts">
    import type { Playlist } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { Icon } from "svelte-m3c";

    import playlistActions from "../action/playlistActions";
    import PlaylistLink from "../link/PlaylistLink.svelte";
    import ListItem from "./ListItem.svelte";

    let {
        playlist,
    }: {
        playlist: Playlist;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(playlist.uri));

    let actions = $derived(playlistActions(mopidy, playlist));

    $effect(() => {
        mopidy.requestImages([playlist.uri]);
    });
</script>

<ListItem {actions} lines={1}>
    {#snippet leading()}
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
