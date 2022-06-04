<script>
	import Heading from "./Heading.svelte";

	export let rows = [];
	export let details = false;
	export let mode;
</script>

<thead>
	<tr>
		{#key details}
			<Heading name={"title"} bind:rows bind:mode />
			{#if details}
				<Heading name={"type"} bind:rows bind:mode />
				<Heading name={"id"} bind:rows bind:mode />
				<Heading name={"author"} bind:rows bind:mode />
				<Heading name={"version"} bind:rows bind:mode />
			{/if}
			<Heading name={"status"} bind:rows bind:mode />
			<Heading name={"notes"} bind:rows bind:mode />
		{/key}
	</tr>
</thead>

<style>
	thead {
		position: sticky;
		background-color: #555;
		z-index: 1;
		top: 0;
	}

	tr {
		transition: 250ms;
	}

	tr:hover {
		filter: drop-shadow(0 0 0 black);
	}
</style>
