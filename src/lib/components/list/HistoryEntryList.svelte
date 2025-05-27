<script lang="ts">
    import type { HistoryEntry } from "$lib/types/mopidy";
    import HistoryEntryListItem from "../item/HistoryEntryListItem.svelte";
    import VirtualList from "./VirtualList.svelte";

    let { entries }: { entries: HistoryEntry[] } = $props();
</script>

<VirtualList
    data={entries}
    getKey={(entry) => `${entry.track.uri} ${entry.timestamp.getTime()}`}
>
    {#snippet item(entry)}
        <HistoryEntryListItem {entry} />
    {/snippet}
</VirtualList>
