<script>
	import { getContext } from "svelte";

	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

	export let name;

	const spreadsheetStore = getContext("spreadsheetStore");
	const { sortBy, reversed } = spreadsheetStore.stores;

	// Correctly set direction from initial reversed state when sortBy === name.
	let direction = $sortBy === name && $reversed;

	// Reset direction to false when another sort header is clicked.
	$: if ($sortBy !== name) {
		direction = true;
	}

	/**
	 * Sort the rows by a given heading. Set the `sortBy` store to the heading clicked which will sort the spreadsheet
	 * store. Additionally, set the reversed accessor store that will change the iteration order of the spreadsheet store.
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
		border-right: solid 1px rgba(0, 0, 0, 0.1);
		border-bottom: solid 1px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		font-weight: normal;
	}

	th:first-child {
		border-top-left-radius: 0.5ch;
	}

	th:last-child {
		border-top-right-radius: 0.5ch;
		border-right: none;
	}

	i {
		margin-left: 0.5ch;
	}
</style>
