<script>
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { isV10, localize } from "../utils.js";
	
	export let rows = [];
	export let details = false;

	const colors = {
			X: "#cc0000",
			O: "#f1c232",
			B: "#b45f06",
			G: "#6aa84f",
			N: "#3d85c6",
			A: "#666666",
			U: "#ffffff",
		},
		explanations = {
			X: localize("statuses.x"),
			O: localize("statuses.o"),
			B: localize("statuses.b"),
			G: localize("statuses.g"),
			N: localize("statuses.n"),
			A: localize("statuses.a"),
			U: localize("statuses.u"),
		};
</script>

<tbody>
	{#each rows as row, i (row.id)}
		<tr animate:flip style="background-color: {colors[row.status] + (i % 2 === 0 ? '50' : '80')}">
			<td transition:fade>{row.title}</td>
			{#if details}
				<td transition:fade>{row.type}</td>
				<td transition:fade>{row.id}</td>
				<td transition:fade>{row.author}</td>
				<td transition:fade class="center">{row.version}</td>
			{/if}
			{#if isV10()}
				<td transition:fade class="center" data-tooltip={explanations[row.status]}>{row.status}</td>
			{:else}
				<td transition:fade class="center" title={explanations[row.status]}>{row.status}</td>
			{/if}
			<td transition:fade>{row.notes}</td>
		</tr>
	{/each}
</tbody>

<style scoped>
	td {
		padding: 0.5em;
	}

	tbody {
		overflow: scroll;
	}

	tr {
		transition: 250ms;
	}

	tr:hover {
		filter: drop-shadow(0 0 0 black);
	}

	.center {
		text-align: center;
	}
</style>
