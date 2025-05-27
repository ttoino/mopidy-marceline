<script lang="ts">
    import type { Track } from "$lib/types/mopidy";
    import TrackListItem from "../item/TrackListItem.svelte";
    import VirtualList from "./VirtualList.svelte";

    let { tracks }: { tracks: Track[] } = $props();
</script>

<VirtualList data={tracks} getKey={(track) => track.uri}>
    {#snippet item(track)}
        <TrackListItem {track} />
    {/snippet}
</VirtualList>
