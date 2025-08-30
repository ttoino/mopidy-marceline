<script lang="ts">
    import ArtistHero from "$lib/components/hero/ArtistHero.svelte";
    import RefList from "$lib/components/list/RefList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.artist.name} />
</svelte:head>

<ArtistHero artist={data.artist} />

{#if data.items?.length > 0}
    <RefList items={data.items} />
{:else}
    <p class="m-4 text-title-m text-on-surface-variant">No items available</p>
{/if}
