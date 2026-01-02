<script lang="ts">
    import { getMopidy } from "$lib/context/mopidy";
    import { formatDuration } from "$lib/format";
    import { mergeProps, Popover } from "bits-ui";
    import {
        IconButton,
        Slider,
        StandardButtonGroup,
        ToggleIconButton,
        Tooltip,
    } from "svelte-m3c";
    import { slide } from "svelte/transition";

    import TrackInfo from "./TrackInfo.svelte";
    import TrackPreview from "./TrackPreview.svelte";

    const mopidy = getMopidy();

    let previousTrack = $derived(mopidy.previousTrack());
    let currentTrack = $derived(mopidy.currentTrack());
    let nextTrack = $derived(mopidy.nextTrack());

    let timePosition = $derived(mopidy.timePosition());

    let palette = $derived(
        currentTrack ? mopidy.getPalette(currentTrack.track.uri) : null,
    );
</script>

<aside
    style={await palette}
    class="fixed right-0 bottom-0 left-0 z-50 flex h-20 flex-row items-center gap-8 rounded-t-lg bg-surface-container p-2 text-on-surface-variant"
    transition:slide={{ axis: "y" }}
>
    {#if currentTrack}
        <TrackInfo track={currentTrack.track} />

        {#snippet prev({ props })}
            <IconButton
                icon="skip_previous"
                {...mergeProps(props, {
                    onclick: () => mopidy.skipPrevious(),
                })}
            />
        {/snippet}
        {#snippet next({ props })}
            <IconButton
                icon="skip_next"
                {...mergeProps(props, {
                    onclick: () => mopidy.skipNext(),
                })}
            />
        {/snippet}

        <StandardButtonGroup color="secondary" variant="tonal" width="narrow">
            {#if previousTrack}
                <TrackPreview track={previousTrack.track} trigger={prev} />
            {:else}
                <Tooltip trigger={prev}>Previous track</Tooltip>
            {/if}
            <IconButton
                color="primary"
                icon={mopidy.playbackState() === "playing"
                    ? "pause"
                    : "play_arrow"}
                onclick={() => mopidy.togglePlaybackState()}
                variant="filled"
                width="wide"
            />
            {#if nextTrack}
                <TrackPreview track={nextTrack.track} trigger={next} />
            {:else}
                <Tooltip trigger={next}>Next track</Tooltip>
            {/if}
        </StandardButtonGroup>

        {#if timePosition !== null}
            <div class="flex flex-1 flex-row items-center gap-2">
                <span class="text-label-s">
                    {formatDuration(timePosition)}
                </span>
                <Slider
                    collapsible
                    containerClass="!min-w-auto grow"
                    max={currentTrack.track.length / 1000}
                    onValueCommit={(timePosition: number) =>
                        mopidy.setTimePosition(timePosition * 1000)}
                    type="single"
                    value={timePosition / 1000}
                />
                <span class="text-label-s">
                    {formatDuration(currentTrack.track.length)}
                </span>
            </div>
        {/if}
    {:else}
        <span class="ml-2 grow text-title-m text-on-surface-variant italic">
            Nothing is playing
        </span>
    {/if}

    <div class="mr-2 flex flex-row items-center">
        <ToggleIconButton
            icon="restaurant"
            variant="text"
            bind:pressed={mopidy.consume, mopidy.setConsume}
        />
        <ToggleIconButton
            icon="shuffle"
            variant="text"
            bind:pressed={mopidy.shuffle, mopidy.setShuffle}
        />
        <ToggleIconButton
            icon="repeat"
            variant="text"
            bind:pressed={mopidy.repeat, mopidy.setRepeat}
        />

        <!-- TODO -->
        <Popover.Root>
            <Popover.Trigger>
                {#snippet child({ props })}
                    <IconButton
                        icon={mopidy.mute()
                            ? "no_sound"
                            : mopidy.volume() > 75
                              ? "volume_up"
                              : mopidy.volume() > 25
                                ? "volume_down"
                                : "volume_mute"}
                        variant="text"
                        {...props}
                    />
                {/snippet}
            </Popover.Trigger>
            <Popover.Content
                class="rounded-full bg-surface-container px-2 py-5.5 text-on-surface-variant shadow-2"
            >
                <Slider
                    orientation="vertical"
                    type="single"
                    bind:value={mopidy.volume, mopidy.setVolume}
                />
            </Popover.Content>
        </Popover.Root>

        <!-- <Slider
                class="!min-w-16"
                type="single"
                min={0}
                max={100}
                value={mopidy.volume}
                onValueCommit={(volume: number) => {
                    mopidy.volume = volume;
                }}
            /> -->
    </div>
</aside>
