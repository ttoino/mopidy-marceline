<script lang="ts">
    import type { Track } from "$lib/types/mopidy.js";

    import AlbumHero from "$lib/components/hero/AlbumHero.svelte";
    import TrackList from "$lib/components/list/TrackList.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();

    let discs = $derived(
        data.album.tracks.reduce<Track[][]>((acc, track) => {
            if (acc.at(-1)?.at(-1)?.disc_no !== track.disc_no) {
                acc.push([track]);
            } else {
                acc.at(-1)?.push(track);
            }

            return acc;
        }, []),
    );
</script>

<svelte:head>
    <Title text={data.album.name} />
</svelte:head>

<AlbumHero album={data.album} />

<div class="flex flex-col gap-4">
    {#each discs as disc, index (index)}
        {#if data.album.num_discs > 1}
            <h2 class="px-4 text-display-s">Disc {disc[0].disc_no}</h2>
        {/if}

        <TrackList tracks={disc} />
    {/each}
</div>
