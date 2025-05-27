<script lang="ts">
    import { SEPARATOR } from "$lib/constants";
    import { getMopidy } from "$lib/context/mopidy";
    import { formatDate, formatDateRelative } from "$lib/format";
    import type { HistoryEntry } from "$lib/types/mopidy";
    import { Tooltip, TooltipRoot, TooltipTrigger } from "svelte-m3c";
    import TrackListItem from "./TrackListItem.svelte";

    let {
        entry,
        ...props
    }: {
        entry: HistoryEntry;
    } = $props();

    let mopidy = getMopidy();

    let track = $derived(mopidy.getTrack(entry.track.uri));
</script>

{#if track}
    <TrackListItem {track} {...props}>
        {#snippet trailing()}
            <TooltipRoot>
                <TooltipTrigger
                    class="relative before:absolute before:inset-0 before:z-10"
                >
                    {formatDateRelative(entry.timestamp)} ago
                </TooltipTrigger>
                <Tooltip>
                    {formatDate(entry.timestamp)}
                </Tooltip>
            </TooltipRoot>

            <span>{SEPARATOR}</span>
        {/snippet}
    </TrackListItem>
{/if}
