<script lang="ts">
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

    const mopidy = getMopidy();
</script>

<div class="flex flex-row items-center gap-2">
    <Button
        icon="clear"
        onclick={async () => await mopidy.clearQueue()}
        variant="filled"
    >
        Clear
    </Button>

    <Button
        containerClass="max-medium:hidden"
        icon="shuffle"
        onclick={async () => await mopidy.shuffleQueue()}
    >
        Shuffle
    </Button>

    <Menu type="dropdown">
        <MenuTrigger>
            {#snippet child({ props })}
                <IconButton
                    containerClass="medium:hidden"
                    icon="more_horiz"
                    {...props}
                />
            {/snippet}
        </MenuTrigger>
        <MenuList>
            <MenuItem onSelect={async () => await mopidy.shuffleQueue()}>
                {#snippet text()}
                    Shuffle
                {/snippet}
                {#snippet leading()}
                    <Icon icon="shuffle" />
                {/snippet}
            </MenuItem>
        </MenuList>
    </Menu>
</div>
