<script lang="ts">
    import Hero from "$lib/components/hero/Hero.svelte";
    import HistoryEntryList from "$lib/components/list/HistoryEntryList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text="History" />
</svelte:head>

<Hero>
    {#snippet title()}History{/snippet}
    {#snippet subtitle()}
        {data.history.length} entr{data.history.length === 1 ? "y" : "ies"}
    {/snippet}
</Hero>

<HistoryEntryList entries={data.history} />
