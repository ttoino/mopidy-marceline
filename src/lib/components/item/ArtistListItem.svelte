<script lang="ts">
    import type { ArtistRef } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { Icon } from "svelte-m3c";

    import ArtistLink from "../link/ArtistLink.svelte";
    import ListItem from "./ListItem.svelte";
    import SkeletonListItem from "./SkeletonListItem.svelte";

    let {
        artist: ref,
    }: {
        artist: ArtistRef;
    } = $props();

    const mopidy = getMopidy();
</script>

<SkeletonListItem>
    {@const artist = await mopidy.getArtist(ref.uri)}

    <ListItem lines={1}>
        {#snippet leading()}
            {@const image = await mopidy.getMainImage(ref.uri)}

            {#if image}
                <img
                    class="aspect-square h-full rounded-full object-cover"
                    alt="Album cover"
                    src={image}
                />
            {:else}
                <Icon icon="artist" />
            {/if}
        {/snippet}
        {#snippet labelText()}
            <ArtistLink {artist} contained={false} />
        {/snippet}
    </ListItem>
</SkeletonListItem>
