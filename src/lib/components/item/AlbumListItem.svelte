<script lang="ts">
    import type { AlbumWithTracks } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { Icon } from "svelte-m3c";

    import albumActions from "../action/albumActions";
    import AlbumLink from "../link/AlbumLink.svelte";
    import ArtistsLinks from "../link/ArtistsLinks.svelte";
    import ListItem from "./ListItem.svelte";

    let {
        album,
    }: {
        album: AlbumWithTracks;
    } = $props();

    const mopidy = getMopidy();

    let actions = $derived(albumActions(mopidy, album));

    let image = $derived(mopidy.getImage(album.uri));

    $effect(() => {
        mopidy.requestImages([album.uri]);
    });
</script>

<ListItem {actions} lines={2}>
    {#snippet leading()}
        {#if image}
            <img
                class="aspect-square h-full object-cover"
                alt="Album cover"
                src={image}
            />
        {:else}
            <Icon icon="album" />
        {/if}
    {/snippet}
    {#snippet labelText()}
        <AlbumLink {album} contained={false} />
    {/snippet}
    {#snippet supportingText()}
        <ArtistsLinks artists={album.artists} />
    {/snippet}
    {#snippet trailing()}
        {album.num_tracks} tracks
    {/snippet}
</ListItem>
