<script lang="ts">
    import { base } from "$app/paths";
    import type MopidyState from "$lib/state/mopidy.svelte";
    import type { Track } from "$lib/types/mopidy";
    import { getContext } from "svelte";

    let mopidy = getContext("mopidy") as MopidyState;

    let {
        track,
    }: {
        track: Track;
    } = $props();

    let image = $derived(mopidy.getImage(track.uri));
    let palette = $derived(image ? mopidy.getPallete(image) : undefined);

    $effect(() => {
        mopidy.requestImages([track.uri]).then((images) => {
            if (images && images[0]) mopidy.requestPalette(images[0]);
        });
    });
</script>

<div class="flex h-16 flex-row items-center gap-4 palette" style={palette}>
    {#if image}
        <img
            src={image}
            alt="Album cover"
            class="aspect-square h-full rounded-md object-cover"
        />
    {/if}
    <div class="flex w-40 flex-col first:pl-2">
        <a
            class="truncate !text-title-m hover:underline"
            href="{base}/track/{encodeURIComponent(track.uri)}"
        >
            {track.name}
        </a>
        <span class="truncate text-title-s text-outline">
            {#each track.artists as artist (artist.uri)}
                <span class="not-last:after:content-[',_']">
                    {artist.name}
                </span>
            {/each}
        </span>
    </div>
</div>
