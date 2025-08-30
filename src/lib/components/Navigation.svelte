<script lang="ts" module>
    import type { ComponentProps } from "svelte";
    import type { Icon } from "svelte-m3c";

    const destinations = [
        {
            href: "/",
            icon: "playlist_play",
            label: "Queue",
        },
        {
            href: "/library",
            icon: "folder",
            label: "Library",
        },
        {
            href: "/artist",
            icon: "artist",
            label: "Artists",
        },
        {
            href: "/album",
            icon: "album",
            label: "Albums",
        },
        {
            href: "/track",
            icon: "music_note",
            label: "Tracks",
        },
        {
            href: "/playlist",
            icon: "queue_music",
            label: "Playlists",
        },
        {
            href: "/history",
            icon: "history",
            label: "History",
        },
    ] as const satisfies {
        href: string;
        icon: ComponentProps<typeof Icon>["icon"];
        label: string;
    }[];
</script>

<script lang="ts">
    import { page } from "$app/state";
    import { resolve } from "$lib/navigation";
    import {
        NavigationDrawer,
        NavigationDrawerItem,
        NavigationRail,
        NavigationRailItem,
    } from "svelte-m3c";

    let active = $derived(
        destinations.findLastIndex(({ href }) =>
            page.url.pathname.includes(href),
        ),
    );
</script>

<NavigationDrawer class="max-large:hidden">
    {#each destinations as { href, icon, label }, index (index)}
        <NavigationDrawerItem
            active={index === active}
            href={resolve(href)}
            {icon}
        >
            {label}
        </NavigationDrawerItem>
    {/each}
</NavigationDrawer>

<NavigationRail class="py-8 max-medium:hidden large:hidden">
    {#each destinations as { href, icon, label }, index (index)}
        <NavigationRailItem
            active={index === active}
            href={resolve(href)}
            {icon}
        >
            {label}
        </NavigationRailItem>
    {/each}
</NavigationRail>
