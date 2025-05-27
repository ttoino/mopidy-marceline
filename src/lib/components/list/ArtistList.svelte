<script lang="ts">
    import type { Artist } from "$lib/types/mopidy";
    import ArtistListItem from "../item/ArtistListItem.svelte";
    import VirtualList from "./VirtualList.svelte";

    let { artists }: { artists: Artist[] } = $props();
</script>

<VirtualList data={artists} getKey={(artist) => artist.uri}>
    {#snippet item(artist)}
        <ArtistListItem {artist} />
    {/snippet}
</VirtualList>
