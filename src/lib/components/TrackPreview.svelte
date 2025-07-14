<script lang="ts">
    import type { Track } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import { getMopidy } from "$lib/context/mopidy";
    import { Tooltip } from "svelte-m3c";

    import TrackInfo from "./TrackInfo.svelte";

    let {
        track,
        ...props
    }: {
        track: Track;
    } & Omit<ComponentProps<typeof Tooltip>, "children" | "variant"> = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(track.uri));
    let palette = $derived(image ? mopidy.getPalette(image) : undefined);

    $effect(() => {
        mopidy.requestImages([track.uri]).then((images) => {
            if (images && images[0]) mopidy.requestPalette(images[0]);
        });
    });
</script>

<!-- FIXME: palette doesn't work -->
<Tooltip
    style={palette}
    class="rounded-md bg-surface-container p-2 text-on-surface-variant shadow-2"
    variant="rich"
    {...props}
>
    <TrackInfo {track} />
</Tooltip>
