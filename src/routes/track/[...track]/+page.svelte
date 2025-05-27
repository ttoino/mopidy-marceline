<script lang="ts">
    import TrackHero from "$lib/components/hero/TrackHero.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.track.name} />
</svelte:head>

<TrackHero track={data.track} />
