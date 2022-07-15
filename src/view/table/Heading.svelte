<script>
	import { getContext } from "svelte";

	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper"

	export let name;

	const spreadsheetStore = getContext("spreadsheetStore");
    const { sortBy, reversed } = spreadsheetStore.stores;

	// Correctly set direction from initial reversed state when sortBy === name.
	let direction = $sortBy === name && $reversed;

	// Reset direction to false when another sort header is clicked.
	$: if ($sortBy !== name) { direction = true; }

	/**
	 * Sort the rows by a given heading
	 * @param heading - The heading to sort by
	 */
	function setSortBy(heading) {
		// Update the current sorting mode
		$sortBy = heading;

		// Reverse the order if the direction is "up"
		direction = !direction;
		$reversed = direction;
	}
</script>

<th on:click={() => setSortBy(name)}>
	{localize(`mcc.${name}`)}
	<i class="fas fa-sort{$sortBy !== name ? '' : direction ? '-up' : '-down'}" />
</th>

<style>
	th {
		white-space: nowrap;
		padding: 1ch;
		border-right: solid 2px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	th:last-child {
		border-right: none;
	}

	i {
		margin-left: 0.5ch;
	}
</style>
