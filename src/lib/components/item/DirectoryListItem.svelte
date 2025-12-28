<script lang="ts">
    import type { DirectoryRef } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { Icon } from "svelte-m3c";

    import DirectoryLink from "../link/DirectoryLink.svelte";
    import ListItem from "./ListItem.svelte";
    import SkeletonListItem from "./SkeletonListItem.svelte";

    let {
        directory: ref,
    }: {
        directory: DirectoryRef;
    } = $props();

    const mopidy = getMopidy();
</script>

<SkeletonListItem>
    {@const directory = await mopidy.getDirectory(ref.uri)}

    <ListItem containerClass="relative" lines={1}>
        {#snippet leading()}
            {@const image = ref.uri ? await mopidy.getMainImage(ref.uri) : null}

            {#if image}
                <img
                    class="aspect-square h-full rounded-full object-cover"
                    alt="Album cover"
                    src={image}
                />
            {:else}
                <Icon icon="folder" />
            {/if}
        {/snippet}
        {#snippet labelText()}
            <DirectoryLink contained={false} {directory} />
        {/snippet}
    </ListItem>
</SkeletonListItem>
