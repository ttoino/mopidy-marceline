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
        index: baseIndex,
        indexClass,
        leading: baseLeading,
        maxIndex: baseMaxIndex,
        maxIndexClass,
        track,
        trailing: baseTrailing,
    }: {
        active?: boolean;
        index?: number;
        indexClass?: string;
        maxIndex?: number;
        maxIndexClass?: string;
        track: Track;
    } & Partial<
        Pick<
            ComponentProps<typeof ListItem>,
            "actions" | "leading" | "trailing"
        >
    > = $props();

    let index = $derived(baseIndex ?? track.track_no);
    let maxIndex = $derived(baseMaxIndex ?? track.album.num_tracks);

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
        <span
            class="inline-grid grid-cols-1 grid-rows-1 justify-items-end *:col-span-full *:row-span-full"
        >
            <span class="transition-opacity {indexClass}">{index}</span>
            <span
                class="pointer-events-none opacity-0 {maxIndexClass}"
                aria-hidden="true">{maxIndex}</span
            >

            {@render baseLeading?.()}
        </span>

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
