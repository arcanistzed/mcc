<script>
	/**
	 * This component wires up the table header along w/ the StickyHeader component above the table header.
	 */
	import { getContext } from "svelte";

	import StickyHeader from "./StickyHeader.svelte";
	import Heading from "./Heading.svelte";

	const { details } = getContext("spreadsheetStore").stores;
</script>

<thead>
	<StickyHeader />
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
		background-color: rgb(211, 209, 196);
		z-index: 1;
		top: 0;
	}

	/* Override Foundry core rule */
	tr:nth-child(even) {
		background: linear-gradient(to bottom, #283048, #859398);
	}

	tr {
		transition: 250ms;
		border: solid 1px black;
	}

	tr:hover {
		filter: drop-shadow(0 0 0 black);
	}
</style>
