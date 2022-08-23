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
	<p>{localize("mcc.report.visible")}: {$spreadsheetStore.index.length} / {$spreadsheetStore.length}</p>
	<p title={localize("mcc.percentageFilteredTooltip")}>{localize("mcc.report.percentage")}: {$filteredPercentage}%</p>
	<p>{SpreadsheetController.spreadsheetStatus}</p>
	<a href={`https://docs.google.com/spreadsheets/d/${SpreadsheetController.spreadsheetID}/pubhtml`}>
		{localize("mcc.source")}
		<i class="fas fa-external-link-alt" />
	</a>
</footer>

<style>
	footer {
		max-height: 2rem;
		margin: 0 calc(1ch + 6px) 1ch 1ch;
		background-color: var(--mcc-dark-color);
		color: var(--mcc-text-light-color);
		text-align: center;
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 1ch;
		border-bottom-left-radius: 0.5ch;
		border-bottom-right-radius: 0.5ch;
		white-space: nowrap;
	}

	a {
		color: var(--mcc-text-light-color);
	}
</style>
