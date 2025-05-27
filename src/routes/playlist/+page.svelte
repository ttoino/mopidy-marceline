<script lang="ts">
    import PlaylistList from "$lib/components/list/PlaylistList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text="Playlists" />
</svelte:head>

<PlaylistList playlists={data.playlists} />
