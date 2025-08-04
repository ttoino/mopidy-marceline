<script lang="ts">
    import type { TlTrack } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { Checkbox } from "svelte-m3c";

    import tlTrackActions from "../action/tlTrackActions";
    import TrackListItem from "./TrackListItem.svelte";

    let {
        index: baseIndex,
        maxIndex: baseMaxIndex,
        selected = $bindable(false),
        selecting = false,
        track,
    }: {
        index?: number;
        maxIndex?: number;
        selected?: boolean;
        selecting?: boolean;
        track: TlTrack;
    } = $props();

    const mopidy = getMopidy();

    let actions = $derived(tlTrackActions(mopidy, track));

    let active = $derived(track.tlid === mopidy.currentTrack?.tlid);

    let index = $derived(
        baseIndex ?? mopidy.queue.findIndex((t) => t.tlid === track.tlid) + 1,
    );

    let maxIndex = $derived(baseMaxIndex ?? mopidy.queue.length + 1);
</script>

<TrackListItem
    {actions}
    {active}
    {index}
    indexClass={!selecting ? "group-hover/list-item:opacity-0" : "opacity-0"}
    {maxIndex}
    track={track.track}
>
    {#snippet leading()}
        <Checkbox
            containerClass="transition-opacity {!selecting
                ? 'group-[&:not(:hover)]/list-item:opacity-0'
                : ''}"
            stateLayerClass="z-20"
            bind:checked={selected}
        />
    {/snippet}
</TrackListItem>
