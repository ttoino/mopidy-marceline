<script lang="ts">
    import AlbumHero from "$lib/components/hero/AlbumHero.svelte";
    import TrackList from "$lib/components/list/TrackList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.album.name} />
</svelte:head>

<AlbumHero album={data.album} />

<TrackList tracks={data.album.tracks} />
