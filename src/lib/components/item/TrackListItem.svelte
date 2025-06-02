<script lang="ts">
    import type { Track } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import { SEPARATOR } from "$lib/constants";
    import { getMopidy } from "$lib/context/mopidy";
    import { formatDuration } from "$lib/format";
    import { Icon } from "svelte-m3c";

    import trackActions from "../action/trackActions";
    import AlbumLink from "../link/AlbumLink.svelte";
    import ArtistsLinks from "../link/ArtistsLinks.svelte";
    import TrackLink from "../link/TrackLink.svelte";
    import ListItem from "./ListItem.svelte";

    let {
        actions: act,
        leading: lead,
        track,
        trailing: trail,
    }: {
        track: Track;
    } & Partial<
        Pick<
            ComponentProps<typeof ListItem>,
            "actions" | "leading" | "trailing"
        >
    > = $props();

    const mopidy = getMopidy();

    let actions = $derived(act ?? trackActions(mopidy, track));

    let active = $derived(track.uri === mopidy.currentTrack?.track.uri);

    let image = $derived(mopidy.getImage(track.uri));
</script>

<ListItem
    {actions}
    labelTextClass={active ? "text-primary" : ""}
    leadingClass="inline-flex flex-row items-center gap-4"
    lines={2}
    supportingTextClass={active ? "text-secondary" : ""}
>
    {#snippet leading()}
        {@render lead?.()}

        {#if image}
            <img
                class="aspect-square h-full object-cover"
                alt="Album cover"
                src={image}
            />
        {:else}
            <Icon icon="music_note" />
        {/if}
    {/snippet}
    {#snippet labelText()}
        <TrackLink contained={false} {track} />
    {/snippet}
    {#snippet supportingText()}
        <ArtistsLinks artists={track.artists} />
        {SEPARATOR}
        <AlbumLink album={track.album} />
    {/snippet}
    {#snippet trailing()}
        {@render trail?.()}

        {formatDuration(track.length)}
    {/snippet}
</ListItem>
