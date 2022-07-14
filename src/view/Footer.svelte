<script>
	import { getContext } from "svelte";

	import { isV10, localize } from "../utils.js";
	import SpreadsheetController from "../controller/SpreadsheetController.js";

	const spreadsheetStore = getContext("spreadsheetStore");

	const { filteredPercentage } = spreadsheetStore.stores;
</script>

<footer>
	<p>{localize("report.count")}: {$spreadsheetStore.index.length} / {$spreadsheetStore.length}</p>
	<p title={localize("percentageFilteredTooltip")}>{localize("report.percentage")}: {$filteredPercentage}%</p>
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
		background: linear-gradient(to top, #283048, #859398);
		bottom: -0.5px; /* A small negative value prevents a 1px gap from sporadically showing */
		color: white;
		text-align: center;
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 1ch;
		border-top: solid 1px rgba(0, 0, 0, 0.2);
		border-bottom: solid 1px rgba(0, 0, 0, 0.2);
	}

	a {
		color: white;
		white-space: nowrap;
	}
</style>
