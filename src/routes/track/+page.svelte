<script lang="ts">
    import tracksActions from "$lib/components/action/tracksActions.js";
    import Hero from "$lib/components/hero/Hero.svelte";
    import TrackList from "$lib/components/list/TrackList.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy.js";

    const mopidy = getMopidy();
    const tracks = await mopidy.tracks;
</script>

<svelte:head>
    <Title text="Tracks" />
</svelte:head>

<Hero actions={tracksActions(mopidy, tracks)}>
    {#snippet title()}All tracks{/snippet}
    {#snippet subtitle()}
        {tracks.length} track{tracks.length === 1 ? "" : "s"}
    {/snippet}
</Hero>

<TrackList {tracks} />
