<script>
	import { getContext } from "svelte";

	import { localize } from "../utils.js";

	export let name;

	const spreadsheetStore = getContext("spreadsheetStore");
    const sortByStore = spreadsheetStore.stores.sortBy;

	let direction = false;

	// Reset direction to false when another sort header is clicked.
	$: if ($sortByStore !== name) { direction = false; }

	/**
	 * Sort the rows by a given heading
	 * @param heading - The heading to sort by
	 */
	function sortBy(heading) {
		// Update the current sorting mode
		$sortByStore = heading;

		// Reverse the order if the direction is "up"
		direction = !direction;
		// if (direction) $spreadsheetStore = $spreadsheetStore.reverse();
	}
</script>

<th on:click={() => sortBy(name)}>
	{localize(name)}
	<i class="fas fa-sort{$sortByStore !== name ? '' : direction ? '-up' : '-down'}" />
</th>

<style>
	th {
		white-space: nowrap;
		padding: 1ch;
		border-right: solid 1px;
		border-color: black;
	}

	th:last-child {
		border-right: none;
	}

	i {
		margin-left: 0.5ch;
	}
</style>
