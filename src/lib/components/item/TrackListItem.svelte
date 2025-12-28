<script lang="ts" module>
    const shapes = [
        "mask-shape-sunny",
        "mask-shape-6-sided-cookie",
        "mask-shape-7-sided-cookie",
        "mask-shape-9-sided-cookie",
        "mask-shape-8-leaf-clover",
    ] as const;
</script>

<script lang="ts">
    import type { TrackRef } from "$lib/types/mopidy";
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
    import SkeletonListItem from "./SkeletonListItem.svelte";

    let {
        actions: baseActions,
        active: baseActive,
        index,
        indexClass,
        leading: baseLeading,
        maxIndex,
        maxIndexClass,
        track: ref,
        trailing: baseTrailing,
    }: {
        active?: boolean;
        index?: number;
        indexClass?: string;
        maxIndex?: number;
        maxIndexClass?: string;
        track: TrackRef;
    } & Partial<
        Pick<
            ComponentProps<typeof ListItem>,
            "actions" | "leading" | "trailing"
        >
    > = $props();

    const mopidy = getMopidy();

    let active = $derived(
        baseActive ?? ref.uri === mopidy.currentTrack?.track.uri,
    );
</script>

<SkeletonListItem>
    {@const track = await mopidy.getTrack(ref.uri)}
    {@const actions = baseActions ?? trackActions(mopidy, track)}

    <ListItem
        {actions}
        labelTextClass={active ? "text-primary" : ""}
        leadingClass="inline-flex flex-row items-center gap-4"
        lines={2}
        supportingTextClass={active ? "text-secondary" : ""}
    >
        {#snippet leading()}
            {@const image = await mopidy.getMainImage(ref.uri)}
            {@const shape =
                shapes[(await hashToNumber(ref.uri)) % shapes.length]}

            {#if index !== undefined}
                <span
                    class="inline-grid grid-cols-1 grid-rows-1 justify-items-end *:col-span-full *:row-span-full"
                >
                    <span class="transition-opacity {indexClass}">{index}</span>
                    {#if maxIndex !== undefined}
                        <span
                            class="pointer-events-none opacity-0 {maxIndexClass}"
                            aria-hidden="true">{maxIndex}</span
                        >
                    {/if}

                    {@render baseLeading?.()}
                </span>
            {/if}

            {#if image}
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
</SkeletonListItem>
