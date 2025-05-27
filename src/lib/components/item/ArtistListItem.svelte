<script lang="ts">
    import type { Artist } from "$lib/types/mopidy";

    import { base } from "$app/paths";
    import { getMopidy } from "$lib/context/mopidy";
    import { Icon, ListItem } from "svelte-m3c";

    let {
        artist,
        ...props
    }: {
        artist: Artist;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(artist.uri));
</script>

<ListItem lines={1} {...props}>
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
        <a
            class="after:absolute after:inset-0 after:z-10 hover:underline"
            href="{base}/artist/{encodeURIComponent(artist.uri)}"
        >
            {artist.name}
        </a>
    {/snippet}
</ListItem>
