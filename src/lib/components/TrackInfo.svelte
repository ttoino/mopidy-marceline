<script lang="ts">
    import type { Track } from "$lib/types/mopidy";

    import { base } from "$app/paths";
    import { getMopidy } from "$lib/context/mopidy";

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
