<script lang="ts">
    import Hero from "$lib/components/hero/Hero.svelte";
    import PlaylistList from "$lib/components/list/PlaylistList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text="Playlists" />
</svelte:head>

<Hero>
    {#snippet title()}All playlists{/snippet}
    {#snippet subtitle()}
        {data.playlists.length} playlist{data.playlists.length === 1 ? "" : "s"}
    {/snippet}
</Hero>

<PlaylistList playlists={data.playlists} />
