<script lang="ts">
    import TrackHero from "$lib/components/hero/TrackHero.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.track.name} />
</svelte:head>

<TrackHero track={data.track} />

{#if data.lyrics && data.lyrics.plain.length > 0}
    <div class="mx-4">
        <h2 class="mb-4 text-display-m">Lyrics</h2>

        <div class="columns-[40ch]">
            {#each data.lyrics.plain as group, i (i)}
                <p class="mb-4 text-body-l not-only:break-inside-avoid">
                    {#each group as line, j (j)}
                        {#if j > 0}
                            <br />
                        {/if}

                        {line}
                    {/each}
                </p>
            {/each}
        </div>
    </div>
{/if}
