<script lang="ts">
    import Hero from "$lib/components/hero/Hero.svelte";
    import RefList from "$lib/components/list/RefList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.directory.name ?? "Library"} />
</svelte:head>

<Hero>
    {#snippet title()}{data.directory.name ?? "Library"}{/snippet}
    {#snippet subtitle()}
        {data.directory.children.length}
        item{data.directory.children.length === 1 ? "" : "s"}
    {/snippet}
</Hero>

<RefList items={data.directory.children} />
