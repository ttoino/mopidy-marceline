<script lang="ts">
    import RefList from "$lib/components/list/RefList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.directory.name ?? "Library"} />
</svelte:head>

<RefList items={data.directory.children} />
