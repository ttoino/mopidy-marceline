<script lang="ts">
    import Hero from "$lib/components/hero/Hero.svelte";
    import PlaylistList from "$lib/components/list/PlaylistList.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy";

    const mopidy = getMopidy();
    const playlists = mopidy.playlists;
</script>

<svelte:head>
    <Title text="Playlists" />
</svelte:head>

<Hero>
    {#snippet title()}All playlists{/snippet}
    {#snippet subtitle()}
        {playlists.length} playlist{playlists.length === 1 ? "" : "s"}
    {/snippet}
</Hero>

<PlaylistList {playlists} />
