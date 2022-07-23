<script>
	import { getContext } from "svelte";

	import Heading from "./Heading.svelte";

	const { details } = getContext("spreadsheetStore").stores;
</script>

<thead>
	{#key $details}
		<tr>
			<Heading name={"title"} />
			{#if $details}
				<Heading name={"type"} />
				<Heading name={"id"} />
				<Heading name={"version"} />
				<Heading name={"status"} />
			{/if}
			<Heading name={"notes"} />
		</tr>
	{/key}
</thead>

<style>
	thead {
		position: sticky;
		background-color: var(--mcc-dark-color);
        color: var(--mcc-text-light-color);
		top: 0;
		z-index: 1;
	}

	tr {
		transition: background-color 250ms;
	}

	tr:hover {
		filter: drop-shadow(0 0 0 var(--mcc-dark-color));
	}
</style>
