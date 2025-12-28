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

    let palette = $derived(mopidy.getPalette(track.uri));
</script>

<!-- FIXME: palette doesn't work -->
<Tooltip
    style={await palette}
    class="rounded-md bg-surface-container p-2 text-on-surface-variant shadow-2"
    variant="rich"
    {...props}
>
    <TrackInfo {track} />
</Tooltip>
