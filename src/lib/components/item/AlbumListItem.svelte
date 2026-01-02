<script lang="ts">
    import type { AlbumRef } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { Icon } from "svelte-m3c";

    import albumActions from "../action/albumActions";
    import AlbumLink from "../link/AlbumLink.svelte";
    import ArtistsLinks from "../link/ArtistsLinks.svelte";
    import ListItem from "./ListItem.svelte";
    import SkeletonListItem from "./SkeletonListItem.svelte";

    let {
        album: ref,
    }: {
        album: AlbumRef;
    } = $props();

    const mopidy = getMopidy();
</script>

<SkeletonListItem>
    {@const album = await mopidy.getAlbum(ref.uri)}
    {@const actions = albumActions(mopidy, album)}

    <ListItem {actions} lines={2}>
        {#snippet leading()}
            {@const image = await mopidy.getMainImage(ref.uri)}

            {#if image}
                <img
                    class="aspect-square h-full object-cover"
                    alt="Album cover"
                    src={image}
                />
            {:else}
                <Icon icon="album" />
            {/if}
        {/snippet}
        {#snippet labelText()}
            <AlbumLink {album} contained={false} />
        {/snippet}
        {#snippet supportingText()}
            <ArtistsLinks artists={album.artists} />
        {/snippet}
        {#snippet trailing()}
            {album.num_tracks} tracks
        {/snippet}
    </ListItem>
</SkeletonListItem>
