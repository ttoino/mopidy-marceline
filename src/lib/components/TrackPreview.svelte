<script lang="ts">
    import type { Track } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { Tooltip } from "svelte-m3c";

    import TrackInfo from "./TrackInfo.svelte";

    let {
        track,
    }: {
        track: Track;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(track.uri));
    let palette = $derived(image ? mopidy.getPalette(image) : undefined);

    $effect(() => {
        mopidy.requestImages([track.uri]).then((images) => {
            if (images && images[0]) mopidy.requestPalette(images[0]);
        });
    });
</script>

<!-- FIXME: See why this div is needed -->
<div style={palette} class="contents palette">
    <!-- FIXME: Use rich tooltip when implemented -->
    <Tooltip
        class="rounded-md bg-surface-container p-2 text-on-surface-variant shadow-2"
    >
        <TrackInfo {track} />
    </Tooltip>
</div>
