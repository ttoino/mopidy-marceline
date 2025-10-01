<script lang="ts">
    import type { TlTrack } from "$lib/types/mopidy";

    import queueActions from "$lib/components/action/queueActions";
    import tlTracksActions from "$lib/components/action/tlTracksActions";
    import Hero from "$lib/components/hero/Hero.svelte";
    import TlTrackList from "$lib/components/list/TlTrackList.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy";
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

<Hero actions={selected.size == 0 ? actions : selectedActions}>
    {#snippet title()}Queue{/snippet}
    {#snippet subtitle()}
        {selected.size || mopidy.queue.length}
        track{(selected.size || mopidy.queue.length) === 1 ? "" : "s"}
        {selected.size > 0 ? "selected" : ""}
    {/snippet}
</Hero>

<!-- <div class="flex flex-row items-center gap-2 px-4 pt-5 pb-2">
    <span class="flex shrink-0 grow flex-row items-center gap-2">
        <Checkbox
            checked={selected.size == mopidy.queue.length}
            containerClass={selected.size == 0 ? "hidden" : ""}
            indeterminate={selected.size > 0}
        />
        <h1 class="text-display-l">Queue</h1>
    </span>

    <ButtonActions actions={selected.size == 0 ? actions : selectedActions} />
</div> -->

<TlTrackList tracks={mopidy.queue} bind:selected />
