<script>
	/**
	 * This component provides a sticky footer with package count, current filtered percentage data, last spreadsheet
	 * update date, and a link to the current spreadsheet selected.
	 */
	import { getContext } from "svelte";

	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

	import SpreadsheetController from "../../controller/SpreadsheetController.js";

	const spreadsheetStore = getContext("spreadsheetStore");

	const { filteredPercentage } = spreadsheetStore.stores;
</script>

<footer>
	<p>{localize("mcc.report.count")}: {$spreadsheetStore.index.length} / {$spreadsheetStore.length}</p>
	<p title={localize("mcc.percentageFilteredTooltip")}>{localize("mcc.report.percentage")}: {$filteredPercentage}%</p>
	<p>{SpreadsheetController.spreadsheetStatus}</p>
	<a href={`https://docs.google.com/spreadsheets/d/${SpreadsheetController.spreadsheetID}/pubhtml`}>
		{localize("mcc.source")}
		<i class="fas fa-external-link-alt" />
	</a>
</footer>

<style>
	footer {
		position: sticky;
        bottom: 0;
		background-color: #283048;
		color: white;
		text-align: center;
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 1ch;
		border-top: solid 1px rgba(0, 0, 0, 0.2);
		border-bottom: solid 1px rgba(0, 0, 0, 0.2);
        border-bottom-left-radius: 0.5ch;
        border-bottom-right-radius: 0.5ch;
	}

	a {
		color: white;
		white-space: nowrap;
	}
</style>
