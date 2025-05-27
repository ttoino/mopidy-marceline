<script lang="ts">
    import ArtistList from "$lib/components/list/ArtistList.svelte";

    let { data } = $props();
</script>

<ArtistList artists={data.artists} />
