<script lang="ts">
    import Hero from "$lib/components/hero/Hero.svelte";
    import AlbumList from "$lib/components/list/AlbumList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text="Albums" />
</svelte:head>

<Hero>
    {#snippet title()}All albums{/snippet}
    {#snippet subtitle()}
        {data.albums.length} album{data.albums.length === 1 ? "" : "s"}
    {/snippet}
</Hero>

<AlbumList albums={data.albums} />
