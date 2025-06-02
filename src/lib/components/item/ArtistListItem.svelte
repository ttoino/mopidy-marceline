<script lang="ts">
    import type { Artist } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { Icon } from "svelte-m3c";

    import ArtistLink from "../link/ArtistLink.svelte";
    import ListItem from "./ListItem.svelte";

    let {
        artist,
    }: {
        artist: Artist;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(artist.uri));
</script>

<ListItem lines={1}>
    {#snippet leading()}
        {#if image}
            <img
                class="aspect-square h-full rounded-full object-cover"
                alt="Album cover"
                src={image}
            />
        {:else}
            <Icon icon="artist" />
        {/if}
    {/snippet}
    {#snippet labelText()}
        <ArtistLink {artist} contained={false} />
    {/snippet}
</ListItem>
