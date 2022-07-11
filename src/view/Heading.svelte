<script>
	import { getContext } from "svelte";

	import { localize } from "../utils.js";

	export let name;

	const spreadsheetStore = getContext("spreadsheetStore");
    const sortByStore = spreadsheetStore.stores.sortBy;

	let direction = false;

	// $: sortBy($sortByStore);

	/**
	 * Sort the rows by a given heading
	 * @param heading - The heading to sort by
	 */
	function sortBy(heading) {
		// // If there are no contents under this heading, don't sort
		// if (!$spreadsheetStore.some(row => row[heading] !== "")) return;
		//
		// // Update the current sorting mode
		// $sortByStore = heading;
		//
		// // Sort the rows by this heading
		// $spreadsheetStore = $spreadsheetStore.sort((a, b) => a[heading].localeCompare(b[heading]));
		//
		// // Reverse the order if the direction is "up"
		// direction = !direction;
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
