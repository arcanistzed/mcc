<script>
	import { getContext } from "svelte";

	import Heading from "./Heading.svelte";

	export let mode;

	const { details } = getContext("spreadsheetStore").stores;
</script>

<thead>
	<tr>
		{#key $details}
			<Heading name={"title"} bind:mode />
			{#if $details}
				<Heading name={"type"} bind:mode />
				<Heading name={"id"} bind:mode />
				<Heading name={"version"} bind:mode />
				<Heading name={"status"} bind:mode />
			{/if}
			<Heading name={"notes"} bind:mode />
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
