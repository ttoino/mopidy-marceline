<script lang="ts">
    import type { TlTrack } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";

    import tlTrackActions from "../action/tlTrackActions";
    import TrackListItem from "./TrackListItem.svelte";

    let {
        track,
    }: {
        track: TlTrack;
    } = $props();

    const mopidy = getMopidy();

    let actions = $derived(tlTrackActions(mopidy, track));
</script>

<TrackListItem {actions} track={track.track}>
    {#snippet leading()}
        {track.tlid}
    {/snippet}
</TrackListItem>
