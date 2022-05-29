<script>
	import { onMount, afterUpdate } from "svelte";
	import { fade } from "svelte/transition";
	import { verticalTranslate } from "./animate.js";
	import { isV10 } from "../utils.js";

	export let rows = [];
	export let details = false;
	export let statuses;

	/**
	 * Set the color of a row based for an alternating colors effect
	 * @param element - The element to set the color on
	 * @param status - The status of the row
	 * @param i - The index of the row
	 * @param hover - Whether the row is hovered
	 */
	function setColor(element, status, i, hover = false) {
		const { hsl } = statuses[status];
		element.style.backgroundColor =
			i % 2
				? `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] + 10 * hover}%, ${30 * (hover + 2)}%)`
				: `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] + 5 * hover}%, ${50 * (hover + 3)}%)`;
	}

	/**
	 * Set alternating colors for all of the rows based on their status
	 */
	function setAllColors() {
		document.querySelectorAll("tr").forEach((tr, i) => {
			if (tr.dataset.status) setColor(tr, tr.dataset.status, i + 1);
		});
	}

	// Set all colors when the component is mounted
	onMount(setAllColors);

	// Set all colors after the DOM update that occurs when the rows change
	$: afterUpdate(() => setAllColors(rows));
</script>

<tbody>
	{#each rows as row, i (row.id)}
		<tr
			animate:verticalTranslate
			on:mouseenter={e => setColor(e.target, row.status, i, true)}
			on:mouseleave={e => setColor(e.target, row.status, i)}
			data-status={row.status}
		>
			<td transition:fade>{row.title}</td>
			{#if details}
				<td transition:fade>{row.type}</td>
				<td transition:fade>{row.id}</td>
				<td transition:fade>{row.author}</td>
				<td transition:fade class="center">{row.version}</td>
			{/if}
			<td
				transition:fade
				class="center"
				data-tooltip={isV10() ? statuses[row.status].explanation : null}
				title={isV10() ? null : statuses[row.status].explanation}>{row.status}</td
			>
			<td transition:fade>{row.notes}</td>
		</tr>
	{/each}
</tbody>

<style scoped>
	tbody {
		overflow: scroll;
	}

	tr {
		transition: background-color 250ms;
	}

	td, td:first-child {
		padding: 0.5em;
		border-right: solid 1px;
		border-color: black;
	}

	td:last-child {
		border-right: none;
	}

	.center {
		text-align: center;
	}
</style>
