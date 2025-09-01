<script lang="ts">
    import Hero from "$lib/components/hero/Hero.svelte";
    import ArtistList from "$lib/components/list/ArtistList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text="Artists" />
</svelte:head>

<Hero>
    {#snippet title()}All artists{/snippet}
    {#snippet subtitle()}
        {data.artists.length} artist{data.artists.length === 1 ? "" : "s"}
    {/snippet}
</Hero>

<ArtistList artists={data.artists} />
