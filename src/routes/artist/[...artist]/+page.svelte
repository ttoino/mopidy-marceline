<script lang="ts">
    import ArtistHero from "$lib/components/hero/ArtistHero.svelte";
    import AlbumList from "$lib/components/list/AlbumList.svelte";
    import TrackList from "$lib/components/list/TrackList.svelte";
    import Title from "$lib/components/Title.svelte";
    import { sortByDate } from "$lib/sort";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.artist.name} />
</svelte:head>

<ArtistHero artist={data.artist} />

{#if data.artist.albums?.length > 0}
    <AlbumList albums={sortByDate(data.artist.albums)} />
{:else}
    <p class="m-4 text-title-m text-on-surface-variant">No albums available</p>
{/if}

{#if data.tracks?.length > 0}
    <TrackList tracks={sortByDate(data.tracks)} />
{:else}
    <p class="m-4 text-title-m text-on-surface-variant">No tracks available</p>
{/if}
