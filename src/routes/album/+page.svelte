<script lang="ts">
    import AlbumList from "$lib/components/list/AlbumList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text="All albums" />
</svelte:head>

<AlbumList albums={data.albums} />
