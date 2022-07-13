<script>
	import { getContext } from "svelte";

	import { isV10, localize } from "../utils.js";
	import SpreadsheetController from "../controller/SpreadsheetController.js";

	const spreadsheetStore = getContext("spreadsheetStore");

	const { currentPercentage } = spreadsheetStore.stores;
</script>

<footer>
	<p>{localize("report.count")}: {$spreadsheetStore.index.length} / {$spreadsheetStore.length}</p>
	<p title={localize("percentageCurrentTooltip")}>{localize("report.percentage")}: {$currentPercentage}%</p>
	<p>{SpreadsheetController.spreadsheetStatus}</p>
	<a href={`https://docs.google.com/spreadsheets/d/${SpreadsheetController.spreadsheetID}/pubhtml`}>
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
