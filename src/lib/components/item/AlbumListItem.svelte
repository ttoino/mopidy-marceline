<script lang="ts">
    import type { Album } from "$lib/types/mopidy";

    import { base } from "$app/paths";
    import { getMopidy } from "$lib/context/mopidy";
    import { Icon, ListItem } from "svelte-m3c";

    let {
        album,
        ...props
    }: {
        album: Album;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(album.uri));

    $effect(() => {
        mopidy.requestImages([album.uri]);
    });
</script>

<ListItem lines={2} {...props}>
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
        <a
            class="after:absolute after:inset-0 after:z-10 hover:underline"
            href="{base}/album/{encodeURIComponent(album.uri)}"
        >
            {album.name}
        </a>
    {/snippet}
    {#snippet supportingText()}
        {#each album.artists as artist, index (artist.uri)}
            {#if index > 0},
            {/if}
            <a
                class="relative after:absolute after:inset-0 after:z-20 hover:underline"
                href="{base}/artist/{encodeURIComponent(artist.uri)}"
            >
                {artist.name}
            </a>
        {/each}
    {/snippet}
    {#snippet trailing()}
        {album.num_tracks} tracks
    {/snippet}
</ListItem>
