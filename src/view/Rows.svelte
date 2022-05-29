<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { isV10 } from "../utils.js";

	export let rows = [];
	export let details = false;
	export let statuses;

	function alternatingColors(element, status, i, hover = false) {
		const { hsl } = statuses[status];
		element.style.backgroundColor =
			i % 2
				? `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] + 10 * hover}%, ${30 * (hover + 2)}%)`
				: `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] + 5 * hover}%, ${50 * (hover + 3)}%)`;
	}

	onMount(() => {
		document.querySelectorAll("tr").forEach((tr, i) => {
			if (tr.dataset.status) alternatingColors(tr, tr.dataset.status, i + 1);
		});
	});
</script>

<tbody>
	{#each rows as row, i (row.id)}
		<tr
			animate:flip={{ duration: 1000 }}
			on:mouseenter={e => alternatingColors(e.target, row.status, i, true)}
			on:mouseleave={e => alternatingColors(e.target, row.status, i)}
			data-status={row.status}
		>
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
	tr td {
		padding: 0.5em;
	}

	tbody {
		overflow: scroll;
	}

	tr {
		transition: 250ms;
	}

	.center {
		text-align: center;
	}
</style>
