<script lang="ts">
    import Hero from "$lib/components/hero/Hero.svelte";
    import ArtistList from "$lib/components/list/ArtistList.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy";

    const mopidy = getMopidy();
    const artists = await mopidy.artists;
</script>

<svelte:head>
    <Title text="Artists" />
</svelte:head>

<Hero>
    {#snippet title()}All artists{/snippet}
    {#snippet subtitle()}
        {artists.length} artist{artists.length === 1 ? "" : "s"}
    {/snippet}
</Hero>

<ArtistList {artists} />
