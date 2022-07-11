<script>
	import { getContext } from "svelte";

	import Heading from "./Heading.svelte";

	const { details } = getContext("spreadsheetStore").stores;
</script>

<thead>
	<tr>
		{#key $details}
			<Heading name={"title"} />
			{#if $details}
				<Heading name={"type"} />
				<Heading name={"id"} />
				<Heading name={"version"} />
				<Heading name={"status"} />
			{/if}
			<Heading name={"notes"} />
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
