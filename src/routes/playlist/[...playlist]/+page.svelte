<script lang="ts">
    import PlaylistHero from "$lib/components/hero/PlaylistHero.svelte";
    import TrackList from "$lib/components/list/TrackList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.playlist.name} />
</svelte:head>

<PlaylistHero playlist={data.playlist} />

<TrackList tracks={data.playlist.tracks} />
