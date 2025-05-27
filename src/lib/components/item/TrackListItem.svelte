<script lang="ts">
    import type { Track } from "$lib/types/mopidy";
    import type { Snippet } from "svelte";

    import { base } from "$app/paths";
    import { getMopidy } from "$lib/context/mopidy";
    import { formatDuration } from "$lib/format";
    import { Icon, ListItem } from "svelte-m3c";

    let {
        leading: lead,
        track,
        trailing: trail,
        ...props
    }: {
        leading?: Snippet;
        track: Track;
        trailing?: Snippet;
    } = $props();

    const mopidy = getMopidy();

    let active = $derived(track.uri === mopidy.currentTrack?.track.uri);

    let image = $derived(mopidy.getImage(track.uri));
</script>

<ListItem
    labelTextClass={active ? "text-primary" : ""}
    leadingClass="inline-flex flex-row items-center gap-4"
    lines={2}
    supportingTextClass={active ? "text-secondary" : ""}
    {...props}
>
    {#snippet leading()}
        {@render lead?.()}

        {#if image}
            <img
                class="aspect-square h-full object-cover"
                alt="Album cover"
                src={image}
            />
        {:else}
            <Icon icon="music_note" />
        {/if}
    {/snippet}
    {#snippet labelText()}
        <a
            class="after:absolute after:inset-0 after:z-10 hover:underline"
            href="{base}/track/{encodeURIComponent(track.uri)}"
        >
            {track.name}
        </a>
    {/snippet}
    {#snippet supportingText()}
        {#each track.artists as artist, index (artist.uri)}
            {#if index > 0},
            {/if}
            <a
                class="relative after:absolute after:inset-0 after:z-10 hover:underline"
                href="{base}/artist/{encodeURIComponent(artist.uri)}"
            >
                {artist.name}
            </a>
        {/each}
        ‧
        <a
            class="relative after:absolute after:inset-0 after:z-10 hover:underline"
            href="{base}/album/{encodeURIComponent(track.album.uri)}"
        >
            {track.album.name}
        </a>
    {/snippet}
    {#snippet trailing()}
        {@render trail?.()}

        {formatDuration(track.length)}
    {/snippet}
</ListItem>
