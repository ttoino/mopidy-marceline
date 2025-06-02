<script lang="ts">
    import ButtonActions from "$lib/components/action/ButtonActions.svelte";
    import tracksActions from "$lib/components/action/tracksActions.js";
    import TrackList from "$lib/components/list/TrackList.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy.js";

    let { data } = $props();

    const mopidy = getMopidy();

    let actions = $derived(tracksActions(mopidy, data.tracks));
</script>

<svelte:head>
    <Title text="All tracks" />
</svelte:head>

<div class="flex flex-row items-center gap-2 px-4 pt-5 pb-2">
    <h1 class="shrink-0 grow text-display-l">All tracks</h1>

    <ButtonActions {actions} />
</div>

<TrackList tracks={data.tracks} />
