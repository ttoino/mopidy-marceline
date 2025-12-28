<script lang="ts">
    import type { PlaylistRef } from "$lib/types/mopidy";

    import PlaylistListItem from "../item/PlaylistListItem.svelte";
    import VirtualList from "./VirtualList.svelte";

    let { playlists }: { playlists: PlaylistRef[] } = $props();
</script>

<VirtualList data={playlists} getKey={(playlist) => playlist.uri}>
    {#snippet item(playlist)}
        <PlaylistListItem {playlist} />
    {/snippet}
</VirtualList>
