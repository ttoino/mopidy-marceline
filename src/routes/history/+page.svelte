<script lang="ts">
    import HistoryEntryList from "$lib/components/list/HistoryEntryList.svelte";

    let { data } = $props();
</script>

<HistoryEntryList entries={data.history} />
