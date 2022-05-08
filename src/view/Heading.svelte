<script>
	import { fade } from "svelte/transition";
	import { localize } from "../utils.js";

	export let name;
	export let rows = [];
	export let mode = "";
	let direction = false;

	function sortBy(heading) {
		mode = heading;
		rows = rows.sort((a, b) => a[heading].localeCompare(b[heading]));
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
