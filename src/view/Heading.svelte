<script>
	import { fade } from "svelte/transition";
	import { localize } from "../utils.js";

	export let name;
	export let rows = [];
	export let mode = "";
	let direction = false;

	/**
	 * Sort the rows by a given heading
	 * @param heading - The heading to sort by
	 */
	function sortBy(heading) {
		// If there are no contents under this heading, don't sort
		if (!rows.some(row => row[heading] !== "")) return;

		// Update the current sorting mode
		mode = heading;

		// Sort the rows by this heading
		rows = rows.sort((a, b) => a[heading].localeCompare(b[heading]));

		// Reverse the order if the direction is "up"
		direction = !direction;
		if (direction) rows = rows.reverse();
	}
</script>

<th transition:fade on:click={() => sortBy(name)}>
	{localize(name)}
	{#if mode === name}
		<i class="fas fa-sort-{direction ? 'up' : 'down'}" />
	{/if}
</th>

<style scoped>
	th {
		white-space: nowrap;
		padding: 0.5em;
	}
</style>
