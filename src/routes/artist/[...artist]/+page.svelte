<script lang="ts">
    import ArtistHero from "$lib/components/hero/ArtistHero.svelte";
    import AlbumList from "$lib/components/list/AlbumList.svelte";
    import TrackList from "$lib/components/list/TrackList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.artist.name} />
</svelte:head>

<ArtistHero artist={data.artist} />

{#if data.artist.albums?.length > 0}
    <AlbumList albums={data.artist.albums} />
{:else}
    <p class="text-title-m text-on-surface-variant m-4">No albums available</p>
{/if}

{#if data.tracks?.length > 0}
    <TrackList tracks={data.tracks} />
{:else}
    <p class="text-title-m text-on-surface-variant m-4">No tracks available</p>
{/if}
