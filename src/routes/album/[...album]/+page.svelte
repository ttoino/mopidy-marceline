<script lang="ts">
    import AlbumHero from "$lib/components/hero/AlbumHero.svelte";
    import Title from "$lib/components/Title.svelte";
    import TrackList from "$lib/components/TrackList.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.album.name} />
</svelte:head>

<AlbumHero album={data.album} />

{#if data.album.tracks.length > 0}
    <TrackList tracks={data.album.tracks} />
{:else}
    <p class="text-title-m text-on-surface-variant">No tracks available</p>
{/if}
