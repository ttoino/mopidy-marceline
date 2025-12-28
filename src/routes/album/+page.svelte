<script lang="ts">
    import Hero from "$lib/components/hero/Hero.svelte";
    import AlbumList from "$lib/components/list/AlbumList.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy";

    const mopidy = getMopidy();

    const albums = await mopidy.albums;
</script>

<svelte:head>
    <Title text="Albums" />
</svelte:head>

<Hero>
    {#snippet title()}All albums{/snippet}
    {#snippet subtitle()}
        {albums.length} album{albums.length === 1 ? "" : "s"}
    {/snippet}
</Hero>

<AlbumList {albums} />
