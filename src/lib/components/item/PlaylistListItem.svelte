<script lang="ts">
    import type { Playlist } from "$lib/types/mopidy";

    import { base } from "$app/paths";
    import { getMopidy } from "$lib/context/mopidy";
    import { Icon, ListItem } from "svelte-m3c";

    let {
        playlist,
        ...props
    }: {
        playlist: Playlist;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(playlist.uri));

    $effect(() => {
        mopidy.requestImages([playlist.uri]);
    });
</script>

<ListItem lines={1} {...props}>
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
        <a
            class="after:absolute after:inset-0 after:z-10 hover:underline"
            href="{base}/playlist/{encodeURIComponent(playlist.uri)}"
        >
            {playlist.name}
        </a>
    {/snippet}
    {#snippet trailing()}
        {playlist.tracks.length} tracks
    {/snippet}
</ListItem>
