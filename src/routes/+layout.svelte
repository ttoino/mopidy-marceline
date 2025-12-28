<script lang="ts">
    import { page } from "$app/state";
    import Navigation from "$lib/components/Navigation.svelte";

    import "../app.css";

    import Player from "$lib/components/Player.svelte";
    import Search from "$lib/components/Search.svelte";
    import { setMopidy } from "$lib/context/mopidy";
    import { setScroll } from "$lib/context/scroll";
    import { Button, Icon, Progress, Provider, ScrollArea } from "svelte-m3c";

    let { children, data } = $props();

    let scrollRef = $state(null);
    setScroll(() => scrollRef);

    setMopidy(data.mopidy);
</script>

<svelte:boundary>
    {#snippet pending()}
        <div class="flex h-full items-center justify-center">
            <Progress circular value={null} />
        </div>
    {/snippet}

    <!-- {#snippet failed(error, reset)}
        <div class="flex h-full flex-col items-center justify-center">
            <p>{error}</p>
            <Button onclick={reset}>
                <Icon icon="refresh" />
                Retry
            </Button>
        </div>
    {/snippet} -->

    {@const palette =
        (await page.data.palette) ??
        (await data.mopidy.currentTrackPalette) ??
        ""}

    <Provider>
        <div
            style={palette}
            class="flex h-full flex-col bg-surface text-on-surface"
        >
            <div class="flex h-full flex-row pb-20">
                <Navigation />
                <ScrollArea bind:viewportRef={scrollRef}>
                    <Search />
                    <main
                        class="mx-auto flex min-h-full max-w-(--breakpoint-large) flex-col"
                    >
                        <svelte:boundary>
                            {#snippet pending()}
                                <div
                                    class="flex h-full items-center justify-center"
                                >
                                    <Progress circular value={null} />
                                </div>
                            {/snippet}

                            {#snippet failed(error, reset)}
                                {@debug error}
                                <div
                                    class="flex h-full flex-col items-center justify-center"
                                >
                                    <p>{error}</p>
                                    <Button onclick={reset}>
                                        <Icon icon="refresh" />
                                        Retry
                                    </Button>
                                </div>
                            {/snippet}

                            {@render children()}
                        </svelte:boundary>
                    </main>
                </ScrollArea>
            </div>
            <Player />
        </div>
    </Provider>
</svelte:boundary>
