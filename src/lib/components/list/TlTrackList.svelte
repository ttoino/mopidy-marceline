<script lang="ts">
    import type { TlTrack } from "$lib/types/mopidy";
    import TlTrackListItem from "../item/TlTrackListItem.svelte";
    import VirtualList from "./VirtualList.svelte";

    let { tracks }: { tracks: TlTrack[] } = $props();
</script>

<VirtualList data={tracks} getKey={(track) => track.tlid}>
    {#snippet item(track)}
        <TlTrackListItem {track} />
    {/snippet}
</VirtualList>
