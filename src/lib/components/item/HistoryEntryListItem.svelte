<script lang="ts">
    import type { HistoryEntry } from "$lib/types/mopidy";

    import { SEPARATOR } from "$lib/constants";
    import { getMopidy } from "$lib/context/mopidy";
    import { formatDate, formatDateRelative } from "$lib/format";
    import { Tooltip } from "svelte-m3c";

    import TrackListItem from "./TrackListItem.svelte";

    let {
        entry,
        ...props
    }: {
        entry: HistoryEntry;
    } = $props();

    const mopidy = getMopidy();

    let track = $derived(mopidy.getTrack(entry.track.uri));
</script>

{#if track}
    <TrackListItem {track} {...props}>
        {#snippet trailing()}
            <Tooltip>
                {#snippet trigger({ props })}
                    <span
                        class="relative cursor-pointer before:absolute before:inset-0 before:z-10"
                        {...props}
                    >
                        {formatDateRelative(entry.timestamp)} ago
                    </span>
                {/snippet}

                {formatDate(entry.timestamp)}
            </Tooltip>

            <span>{SEPARATOR}</span>
        {/snippet}
    </TrackListItem>
{/if}
