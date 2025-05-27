<script lang="ts">
    import TrackHero from "$lib/components/hero/TrackHero.svelte";
    import TlTrackList from "$lib/components/list/TlTrackList.svelte";
    import QueueActions from "$lib/components/QueueActions.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy";

    const mopidy = getMopidy();
</script>

<svelte:head>
    <Title text={mopidy.currentTrack?.track.name ?? "Queue"} />
</svelte:head>

{#if mopidy.currentTrack?.track}
    <TrackHero track={mopidy.currentTrack.track} />
{/if}

<div class="flex flex-row items-center gap-2 px-4 pt-5 pb-2">
    <h1 class="shrink-0 grow text-display-l">Queue</h1>

    <QueueActions />
</div>

<TlTrackList tracks={mopidy.queue} />

<!-- <Lyrics /> -->
