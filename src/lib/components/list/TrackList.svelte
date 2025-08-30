<script lang="ts">
    import type { Track } from "$lib/types/mopidy";

    import TrackListItem from "../item/TrackListItem.svelte";
    import VirtualList from "./VirtualList.svelte";

    let { numbered = false, tracks }: { numbered?: boolean; tracks: Track[] } =
        $props();
</script>

<VirtualList data={tracks} getKey={(track) => track.uri}>
    {#snippet item(track, index)}
        <TrackListItem
            index={numbered ? index + 1 : undefined}
            maxIndex={tracks.length}
            {track}
        />
    {/snippet}
</VirtualList>
