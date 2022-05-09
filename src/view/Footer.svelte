<script>
	import { fade } from "svelte/transition";
	import { isV10, localize } from "../utils.js";

	export let rows;
	export let details = false;
	export let url;

	let percentage, working, known;

	$: count = rows.length;
	
	// Keep the percentage of working packages up to date
	$: {
		working = rows.filter(row => row.status === "G" || row.status === "N").length;
		known = rows.filter(row => row.status !== "U").length;
		percentage = parseFloat((100 * (working / Math.max(known, 1))).toFixed(2));
	}
</script>

<tfoot>
	<tr>
		<td transition:fade colspan={details ? 4 : 1}>{localize("report.count")}: {count}</td>
		<td transition:fade colspan={details ? 2 : 1}>{localize("report.percentage")}: {percentage}%</td>
		<td transition:fade>
			<a href={url}>
				{localize("source")}
				{#if isV10()}
					<i class="fa-solid fa-arrow-up-right-from-square" />
				{:else}
					<i class="fas fa-external-link-alt" />
				{/if}
			</a>
		</td>
	</tr>
</tfoot>

<style scoped>
	tfoot {
		position: sticky;
		background-color: #555;
		bottom: 0;
		color: white;
		text-align: center;
	}

	a {
		color: white;
		white-space: nowrap;
	}
</style>
