<script lang="ts">
    import type { Track } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import { SEPARATOR } from "$lib/constants";
    import { getMopidy } from "$lib/context/mopidy";
    import { formatDuration } from "$lib/format";
    import { hashToNumber } from "$lib/hash";
    import { Icon } from "svelte-m3c";

    import trackActions from "../action/trackActions";
    import AlbumLink from "../link/AlbumLink.svelte";
    import ArtistsLinks from "../link/ArtistsLinks.svelte";
    import TrackLink from "../link/TrackLink.svelte";
    import ListItem from "./ListItem.svelte";

    const shapes = [
        "mask-shape-sunny",
        "mask-shape-6-sided-cookie",
        "mask-shape-7-sided-cookie",
        "mask-shape-9-sided-cookie",
        "mask-shape-8-leaf-clover",
    ] as const;

    let {
        actions: baseActions,
        active: baseActive,
        leading: baseLeading,
        track,
        trailing: baseTrailing,
    }: {
        active?: boolean;
        track: Track;
    } & Partial<
        Pick<
            ComponentProps<typeof ListItem>,
            "actions" | "leading" | "trailing"
        >
    > = $props();

    const mopidy = getMopidy();

    let actions = $derived(baseActions ?? trackActions(mopidy, track));

    let active = $derived(
        baseActive ?? track.uri === mopidy.currentTrack?.track.uri,
    );

    let activeShape = $derived(
        hashToNumber(track.uri).then((n) => shapes[n % shapes.length]),
    );

    let image = $derived(mopidy.getImage(track.uri));
</script>

<ListItem
    {actions}
    labelTextClass={active ? "text-primary" : ""}
    leadingClass="inline-flex flex-row items-center gap-4"
    lines={2}
    supportingTextClass={active ? "text-secondary" : ""}
>
    {#snippet leading()}
        {@render baseLeading?.()}

        {#if image}
            {#snippet img(shape = "mask-shape-circle")}
                <div
                    class="h-full mask-contain mask-no-repeat [animation-duration:5s] {active
                        ? shape
                        : 'mask-shape-square'}"
                    class:[animation-play-state:paused]={mopidy.playbackState !==
                        "playing"}
                    class:animate-spin={active}
                >
                    <img
                        class="aspect-square h-full object-cover [animation-direction:reverse] [animation-duration:5s]"
                        class:[animation-play-state:paused]={mopidy.playbackState !==
                            "playing"}
                        class:animate-spin={active}
                        alt="Album cover"
                        src={image}
                    />
                </div>
            {/snippet}

            {#await activeShape}
                {@render img()}
            {:then shape}
                {@render img(shape)}
            {/await}
        {:else}
            <Icon icon="music_note" />
        {/if}
    {/snippet}
    {#snippet labelText()}
        <TrackLink contained={false} {track} />
    {/snippet}
    {#snippet supportingText()}
        <ArtistsLinks artists={track.artists} />
        {SEPARATOR}
        <AlbumLink album={track.album} />
    {/snippet}
    {#snippet trailing()}
        {@render baseTrailing?.()}

        {formatDuration(track.length)}
    {/snippet}
</ListItem>
