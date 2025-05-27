<script lang="ts">
    import type { Directory } from "$lib/types/mopidy";

    import { base } from "$app/paths";
    import { getMopidy } from "$lib/context/mopidy";
    import { Icon, ListItem } from "svelte-m3c";

    let {
        directory,
        ...props
    }: {
        directory: Directory;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(
        directory.uri ? mopidy.getImage(directory.uri) : undefined,
    );
</script>

<ListItem containerClass="relative" lines={1} {...props}>
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
        <a
            class="after:absolute after:inset-0 after:z-10 hover:underline"
            href="{base}/library/{encodeURIComponent(directory.uri)}"
        >
            {directory.name}
        </a>
    {/snippet}
</ListItem>
