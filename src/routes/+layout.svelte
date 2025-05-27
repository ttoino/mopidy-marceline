<script lang="ts">
    import { page } from "$app/state";
    import Navigation from "$lib/components/Navigation.svelte";

    import "../app.css";

    import Player from "$lib/components/Player.svelte";
    import Search from "$lib/components/Search.svelte";
    import { setMopidy } from "$lib/context/mopidy";
    import { Provider, ScrollArea } from "svelte-m3c";
    import { setScroll } from "$lib/context/scroll";

    let { children, data } = $props();

    let scrollRef = $state(null);
    setScroll(() => scrollRef);

    setMopidy(data.mopidy);

    let palette = $derived(
        page.data.palette ?? data.mopidy.currentTrackPalette ?? "",
    );
</script>

<Provider>
    <div
        style={palette}
        class="flex h-full flex-col bg-surface text-on-surface palette"
    >
        <div class="flex h-full flex-row pb-20">
            <Navigation />
            <ScrollArea bind:viewportRef={scrollRef}>
                <Search />
                <main class="min-h-full mx-auto flex flex-col max-w-(--breakpoint-large)">
                    {@render children()}
                </main>
            </ScrollArea>
        </div>
        <Player />
    </div>
</Provider>
