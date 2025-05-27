<script lang="ts">
    import type { TlTrack, Track } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { getContext } from "svelte";
    import {
        Icon,
        List,
        Menu,
        MenuItem,
        MenuList,
        MenuTrigger,
    } from "svelte-m3c";
    import { Virtualizer } from "virtua/svelte";

    import TrackListItem from "./item/TrackListItem.svelte";

    let { tracks }: { tracks: TlTrack[] | Track[] } = $props();

    const scroll = getContext("scroll") as () => HTMLElement | null;
    let scrollRef = $derived(scroll());

    let listRef = $state<HTMLElement | null>(null);

    let startMargin = $derived(
        listRef && scrollRef
            ? listRef.getBoundingClientRect().top -
                  scrollRef.getBoundingClientRect().top
            : 0,
    );

    const mopidy = getMopidy();

    $effect(() => {
        mopidy.requestImages(
            tracks.map((t) => ("track" in t ? t.track : t).uri),
        );
    });
</script>

<List bind:ref={listRef}>
    {#if scrollRef}
        <Virtualizer
            data={tracks}
            getKey={(item) => ("tlid" in item ? item.tlid : item.uri)}
            overscan={10}
            {scrollRef}
            {startMargin}
        >
            {#snippet children(item: TlTrack | Track)}
                {@const track = "track" in item ? item.track : item}

                <Menu type="context">
                    <MenuTrigger>
                        {#snippet child({ props })}
                            <TrackListItem {track} {...props} />
                        {/snippet}
                    </MenuTrigger>

                    <MenuList class="z-50">
                        {#if "tlid" in item}
                            <MenuItem
                                onSelect={() =>
                                    mopidy.removeFromQueue(item.tlid)}
                            >
                                {#snippet leading()}<Icon
                                        icon="clear"
                                    />{/snippet}
                                {#snippet text()}Remove from queue{/snippet}
                            </MenuItem>
                        {/if}
                        <MenuItem onSelect={() => mopidy.playNow(track)}>
                            {#snippet leading()}<Icon
                                    icon="play_arrow"
                                />{/snippet}
                            {#snippet text()}Play{/snippet}
                        </MenuItem>
                        <MenuItem onSelect={() => mopidy.playNext(track)}>
                            {#snippet leading()}<Icon icon="resume" />{/snippet}
                            {#snippet text()}Play next{/snippet}
                        </MenuItem>
                        <MenuItem onSelect={() => mopidy.addToQueue(track)}>
                            {#snippet leading()}<Icon icon="add" />{/snippet}
                            {#snippet text()}Add to queue{/snippet}
                        </MenuItem>
                    </MenuList>
                </Menu>
            {/snippet}
        </Virtualizer>
    {/if}
</List>
