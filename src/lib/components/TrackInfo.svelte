<script lang="ts">
    import type { Track } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";

    import ArtistsLinks from "./link/ArtistsLinks.svelte";
    import TrackLink from "./link/TrackLink.svelte";

    let {
        track,
    }: {
        track: Track;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(track.uri));

    $effect(() => {
        mopidy.requestImages([track.uri]);
    });
</script>

<div class="flex h-16 flex-row items-center gap-4">
    {#if image}
        <img
            class="aspect-square h-full rounded-md object-cover"
            alt="Album cover"
            src={image}
        />
    {/if}
    <div class="flex w-40 flex-col first:pl-2">
        <TrackLink class="truncate text-title-m" {track} />
        <ArtistsLinks
            class="truncate text-title-s text-outline"
            artists={track.artists}
        />
    </div>
</div>
