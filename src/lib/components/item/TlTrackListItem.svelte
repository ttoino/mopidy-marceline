<script lang="ts">
    import type { TlTrack } from "$lib/types/mopidy";

    import TrackListItem from "./TrackListItem.svelte";

    let {
        track,
        ...props
    }: {
        track: TlTrack;
    } = $props();
</script>

<TrackListItem track={track.track} {...props}>
    {#snippet leading()}
        {track.tlid}
    {/snippet}
</TrackListItem>
