<script lang="ts">
    import type { Playlist } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";

    import playlistActions from "../action/playlistActions";
    import PlaylistLink from "../link/PlaylistLink.svelte";
    import Hero from "./Hero.svelte";

    let {
        playlist,
    }: {
        playlist: Playlist;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(playlist.uri));

    let actions = $derived(playlistActions(mopidy, playlist));
</script>

<Hero {actions} {image}>
    {#snippet title()}
        <PlaylistLink {playlist} />
    {/snippet}

    {#snippet subtitle()}{/snippet}
</Hero>
