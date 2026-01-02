<script lang="ts">
    import Hero from "$lib/components/hero/Hero.svelte";
    import HistoryEntryList from "$lib/components/list/HistoryEntryList.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy";

    const mopidy = getMopidy();
    const history = $derived(mopidy.history());
</script>

<svelte:head>
    <Title text="History" />
</svelte:head>

<Hero>
    {#snippet title()}History{/snippet}
    {#snippet subtitle()}
        {history.length} entr{history.length === 1 ? "y" : "ies"}
    {/snippet}
</Hero>

<HistoryEntryList entries={history} />
