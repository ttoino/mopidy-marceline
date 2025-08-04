<script lang="ts">
    import type { TlTrack } from "$lib/types/mopidy";

    import { SvelteSet } from "svelte/reactivity";

    import TlTrackListItem from "../item/TlTrackListItem.svelte";
    import VirtualList from "./VirtualList.svelte";

    let {
        selected = $bindable(new SvelteSet<TlTrack>()),
        tracks,
    }: {
        selected?: SvelteSet<TlTrack>;
        tracks: TlTrack[];
    } = $props();

    let selecting = $derived(selected.size > 0);
</script>

<VirtualList data={tracks} getKey={(track) => track.tlid}>
    {#snippet item(track, index)}
        <TlTrackListItem
            index={index + 1}
            maxIndex={tracks.length}
            {selecting}
            {track}
            bind:selected={
                () => selected.has(track),
                (v) => (v ? selected.add(track) : selected.delete(track))
            }
        />
    {/snippet}
</VirtualList>
