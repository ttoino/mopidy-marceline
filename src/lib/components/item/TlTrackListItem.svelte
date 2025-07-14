<script lang="ts">
    import type { TlTrack } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";

    import tlTrackActions from "../action/tlTrackActions";
    import TrackListItem from "./TrackListItem.svelte";
    import { Checkbox } from "svelte-m3c";

    let {
        track,
        selecting = false,
        selected = $bindable(false),
    }: {
        track: TlTrack;
        selecting?: boolean;
        selected?: boolean;
    } = $props();

    const mopidy = getMopidy();

    let actions = $derived(tlTrackActions(mopidy, track));

    let active = $derived(track.tlid === mopidy.currentTrack?.tlid);

    let index = $derived(
        mopidy.queue.findIndex((t) => t.tlid === track.tlid) + 1,
    );

    let maxIndex = $derived(mopidy.queue.length + 1);
</script>

<TrackListItem {actions} {active} track={track.track}>
    {#snippet leading()}
        <span
            class="inline-grid grid-cols-1 grid-rows-1 justify-items-end *:col-span-full *:row-span-full"
        >
            <span
                class="transition-opacity {!selecting
                    ? 'group-hover/list-item:opacity-0'
                    : 'opacity-0'}">{index}</span
            >
            <span class="pointer-events-none opacity-0" aria-hidden="true"
                >{maxIndex}</span
            >

            <Checkbox
                bind:checked={selected}
                containerClass="transition-opacity {!selecting
                    ? "group-[&:not(:hover)]/list-item:opacity-0"
                    : ""}"
                stateLayerClass="z-20"
            />
        </span>
    {/snippet}
</TrackListItem>
