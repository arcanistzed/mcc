<script>
	import { isV10, localize } from "../utils.js";
	import SpreadsheetController from "../controller/SpreadsheetController.js";

	export let rows;

	let percentage, working, known, count;

	$: count = rows.length;

	// Keep the percentage of working packages up to date
	$: {
		working = rows.filter(row => row.status === "G" || row.status === "N").length;
		known = rows.filter(row => row.status !== "U").length;
		percentage = parseFloat((100 * (working / Math.max(known, 1))).toFixed(2));
	}
</script>

<footer>
	<p>{localize("report.count")}: {count}</p>
	<p>{localize("report.percentage")}: {percentage}%</p>
	<p>{SpreadsheetController.spreadsheetStatus}</p>
	<a href={`https://docs.google.com/spreadsheets/d/${SpreadsheetController.spreadsheetID}/edit`}>
		{localize("source")}
		{#if isV10()}
			<i class="fa-solid fa-arrow-up-right-from-square" />
		{:else}
			<i class="fas fa-external-link-alt" />
		{/if}
	</a>
</footer>

<style>
	footer {
		position: sticky;
		background-color: #555;
		bottom: 0;
		color: white;
		text-align: center;
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 1ch;
		border: solid black 1px;
	}

	a {
		color: white;
		white-space: nowrap;
	}
</style>
