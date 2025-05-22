<script lang="ts">
    import {
        IconButton,
        ToggleIconButton,
        Slider,
        TooltipRoot,
        TooltipTrigger,
        Tooltip,
    } from "svelte-m3c";
    import { slide } from "svelte/transition";
    import { getContext } from "svelte";
    import type MopidyState from "$lib/state/mopidy.svelte";
    import { formatDuration } from "$lib/format";
    import TrackInfo from "./TrackInfo.svelte";
    import { mergeProps } from "bits-ui";

    let mopidy = getContext("mopidy") as MopidyState;
</script>

<aside
    transition:slide={{ axis: "y" }}
    class="fixed right-0 bottom-0 left-0 z-50 flex h-20 flex-row items-center gap-8 rounded-t-lg bg-surface-container p-2 text-on-surface-variant palette"
    style={mopidy.currentTrackPalette}
>
    {#if mopidy.currentTrack}
        <TrackInfo track={mopidy.currentTrack.track} />

        <div class="flex flex-row gap-2">
            <TooltipRoot>
                <TooltipTrigger>
                    {#snippet child({ props })}
                        <IconButton
                            icon="skip_previous"
                            {...mergeProps(props, {
                                onclick: () => mopidy.skipPrevious(),
                            })}
                        />
                    {/snippet}
                </TooltipTrigger>
                {#if mopidy.previousTrack}
                    <Tooltip class="rounded-lg p-2">
                        <TrackInfo track={mopidy.previousTrack.track} />
                    </Tooltip>
                {/if}
            </TooltipRoot>
            <IconButton
                variant="filled"
                icon={mopidy.playbackState === "playing"
                    ? "pause"
                    : "play_arrow"}
                tooltip={mopidy.playbackState === "playing"
                    ? "Pause"
                    : "Resume"}
                onclick={() => {
                    mopidy.togglePlaybackState();
                }}
            />
            <TooltipRoot>
                <TooltipTrigger>
                    {#snippet child({ props })}
                        <IconButton
                            icon="skip_next"
                            {...mergeProps(props, {
                                onclick: () => mopidy.skipNext(),
                            })}
                        />
                    {/snippet}
                </TooltipTrigger>
                {#if mopidy.nextTrack}
                    <Tooltip class="rounded-lg p-2">
                        <TrackInfo track={mopidy.nextTrack.track} />
                    </Tooltip>
                {/if}
            </TooltipRoot>
        </div>

        {#if mopidy.timePosition}
            <div class="flex flex-1 flex-row items-center gap-2">
                <span class="text-label-s">
                    {formatDuration(mopidy.timePosition)}
                </span>
                <Slider
                    class="!min-w-auto grow"
                    type="single"
                    collapsible
                    max={mopidy.currentTrack.track.length / 1000}
                    value={(mopidy.timePosition ?? 0) / 1000}
                    onValueCommit={(timePosition: number) => {
                        mopidy.timePosition = timePosition * 1000;
                    }}
                />
                <span class="text-label-s">
                    {formatDuration(mopidy.currentTrack.track.length)}
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
            title="Consume"
            bind:pressed={mopidy.consume}
        />
        <ToggleIconButton
            icon="shuffle"
            title="Shuffle"
            bind:pressed={mopidy.shuffle}
        />
        <ToggleIconButton
            icon="repeat"
            title="Repeat"
            bind:pressed={mopidy.repeat}
        />
        <IconButton
            icon={mopidy.mute
                ? "no_sound"
                : mopidy.volume > 75
                  ? "volume_up"
                  : mopidy.volume > 25
                    ? "volume_down"
                    : "volume_mute"}
        />

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
