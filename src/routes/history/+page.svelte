<script lang="ts">
    import HistoryEntryList from "$lib/components/list/HistoryEntryList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<Title text="History" />

<HistoryEntryList entries={data.history} />
