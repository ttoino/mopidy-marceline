<script lang="ts">
    import type { Track, TrackURI } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import {
        Button,
        Icon,
        IconButton,
        Menu,
        MenuItem,
        MenuList,
        MenuTrigger,
    } from "svelte-m3c";

    let { tracks }: { tracks: Track[] | TrackURI[] } = $props();

    const mopidy = getMopidy();
</script>

<div class="flex flex-row items-center gap-2">
    <Button
        icon="play_arrow"
        onclick={() => mopidy.playNow(tracks)}
        variant="filled"
    >
        Play
    </Button>

    <Menu type="dropdown">
        <MenuTrigger>
            {#snippet child({ props })}
                <IconButton icon="more_horiz" {...props} />
            {/snippet}
        </MenuTrigger>
        <MenuList>
            <MenuItem onSelect={() => mopidy.playNext(tracks)}>
                {#snippet leading()}
                    <Icon icon="resume" />
                {/snippet}
                {#snippet text()}
                    Play next
                {/snippet}
            </MenuItem>
            <MenuItem onSelect={() => mopidy.addToQueue(tracks)}>
                {#snippet leading()}
                    <Icon icon="add" />
                {/snippet}
                {#snippet text()}
                    Add to queue
                {/snippet}
            </MenuItem>
        </MenuList>
    </Menu>
</div>
