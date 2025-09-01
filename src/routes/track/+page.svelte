<script lang="ts">
    import tracksActions from "$lib/components/action/tracksActions.js";
    import Hero from "$lib/components/hero/Hero.svelte";
    import TrackList from "$lib/components/list/TrackList.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy.js";

    let { data } = $props();

    const mopidy = getMopidy();

    let actions = $derived(tracksActions(mopidy, data.tracks));
</script>

<svelte:head>
    <Title text="Tracks" />
</svelte:head>

<Hero {actions}>
    {#snippet title()}All tracks{/snippet}
    {#snippet subtitle()}
        {data.tracks.length} track{data.tracks.length === 1 ? "" : "s"}
    {/snippet}
</Hero>

<TrackList tracks={data.tracks} />
