<script lang="ts">
    import { getMopidy } from "$lib/context/mopidy";
    import { SvelteMap } from "svelte/reactivity";

    const mopidy = getMopidy();

    // const autoScroll: boolean = $state(true);
    const elements = new SvelteMap<number, HTMLElement>();
    let container: HTMLElement | undefined = $state(undefined);

    let currentTimestamp = $derived.by(() => {
        if (!mopidy.timePosition || !mopidy.currentTrackLyrics) return null;

        const currentTime = mopidy.timePosition;

        return (
            mopidy.currentTrackLyrics.findLast(
                ({ timestamp }) => currentTime >= timestamp,
            )?.timestamp ?? null
        );
    });

    $effect(() => {
        // if (autoScroll)
        if (currentTimestamp)
            elements.get(currentTimestamp)?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
            });
        else
            container?.scrollTo({
                behavior: "smooth",
                top: 0,
            });
    });
</script>

{#if mopidy.currentTrackLyrics}
    <div
        bind:this={container}
        class="relative flex h-full flex-col gap-1 overflow-y-auto scroll-smooth text-center text-display-s text-on-surface-variant"
    >
        <div class="h-[50dvh]"></div>
        {#each mopidy.currentTrackLyrics as lyric (lyric.timestamp)}
            {@const isCurrent = currentTimestamp === lyric.timestamp}
            {@const get = () => elements.get(lyric.timestamp)}
            {@const set = (el: HTMLElement | null) =>
                el
                    ? elements.set(lyric.timestamp, el)
                    : elements.delete(lyric.timestamp)}

            <p
                bind:this={get, set}
                class={[
                    "transition-all",
                    isCurrent && "my-3 text-display-m text-tertiary",
                ]}
            >
                {lyric.lyrics}
            </p>
        {/each}
        <div class="h-[50dvh]"></div>
    </div>
{/if}
