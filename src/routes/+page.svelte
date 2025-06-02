<script lang="ts">
    import ButtonActions from "$lib/components/action/ButtonActions.svelte";
    import queueActions from "$lib/components/action/queueActions";
    import TlTrackList from "$lib/components/list/TlTrackList.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy";

    const mopidy = getMopidy();

    let actions = $derived(queueActions(mopidy));
</script>

<svelte:head>
    <Title text={mopidy.currentTrack?.track.name ?? "Queue"} />
</svelte:head>

<!-- {#if mopidy.currentTrack?.track}
    <TrackHero track={mopidy.currentTrack.track} />
{/if} -->

<div class="flex flex-row items-center gap-2 px-4 pt-5 pb-2">
    <h1 class="shrink-0 grow text-display-l">Queue</h1>

    <ButtonActions {actions} />
</div>

<TlTrackList tracks={mopidy.queue} />

<!-- <Lyrics /> -->
