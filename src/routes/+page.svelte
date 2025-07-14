<script lang="ts">
    import ButtonActions from "$lib/components/action/ButtonActions.svelte";
    import queueActions from "$lib/components/action/queueActions";
    import tlTracksActions from "$lib/components/action/tlTracksActions";
    import TlTrackList from "$lib/components/list/TlTrackList.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy";
    import type { TlTrack } from "$lib/types/mopidy";
    import { Checkbox } from "svelte-m3c";
    import { SvelteSet } from "svelte/reactivity";

    const mopidy = getMopidy();

    let actions = $derived(queueActions(mopidy));

    let selected = new SvelteSet<TlTrack>();
    let selectedActions = $derived(tlTracksActions(mopidy, [...selected]));

    $effect(() => {
        for (const s of selected)
            if (!mopidy.queue.includes(s)) selected.delete(s);
    });
</script>

<svelte:head>
    <Title text={mopidy.currentTrack?.track.name ?? "Queue"} />
</svelte:head>

<div class="flex flex-row items-center gap-2 px-4 pt-5 pb-2">
    <span class="shrink-0 grow flex flex-row items-center gap-2">
        <!-- TODO: Better spacing (align with list) -->
        <Checkbox
            indeterminate={selected.size > 0}
            checked={selected.size == mopidy.queue.length}
            containerClass={selected.size == 0 ? "hidden" : ""}
        />
        <h1 class="text-display-l">Queue</h1>
    </span>

    <ButtonActions actions={selected.size == 0 ? actions : selectedActions} />
</div>

<TlTrackList tracks={mopidy.queue} bind:selected />
