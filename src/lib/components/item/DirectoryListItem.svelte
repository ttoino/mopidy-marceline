<script lang="ts">
    import type { Directory } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { Icon } from "svelte-m3c";

    import DirectoryLink from "../link/DirectoryLink.svelte";
    import ListItem from "./ListItem.svelte";

    let {
        directory,
    }: {
        directory: Directory;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(
        directory.uri ? mopidy.getImage(directory.uri) : undefined,
    );
</script>

<ListItem containerClass="relative" lines={1}>
    {#snippet leading()}
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
