<script>
	import SpreadsheetController from "../controller/SpreadsheetController.js";
	import { localize } from "../utils.js";
	import PieChart from "./PieChart.svelte";
	import Header from "./Header.svelte";
	import Rows from "./Rows.svelte";
	import Footer from "./Footer.svelte";

	export let rows = [];
	export let state;

	let details = false,
		mode;

	const spreadsheetURL = `https://docs.google.com/spreadsheets/d/${SpreadsheetController.spreadsheetID}/edit`;

	SpreadsheetController.getRows()
		.then(result => {
			state = null;
			rows = result;
		})
		.catch(error => {
			state = "error";
			errorMessage = error;
		});

</script>

<main>
	<header>
		<PieChart
			data={[
				{ label: [localize("ready")], value: percentage, hue: 120 },
				{ label: [localize("notReady")], value: 100 - percentage, hue: 0 },
			]}
		/>
		<button on:click={() => (details = !details)}>
			{details ? localize("hide") : localize("show")}
			{localize("details")}
		</button>
	</header>
	<table>
		<Header bind:rows bind:details bind:mode />
		<Rows bind:rows bind:details />
		<Footer bind:rows bind:details url={spreadsheetURL} />
	</table>
	<Footer bind:rows url={spreadsheetURL} />
</main>

<style scoped>
	main {
		display: flex;
		gap: 1em;
		flex-direction: column;
		overflow-y: scroll;
		position: relative;
		margin: 1em;
		padding: 0 0.5em;
	}

	header {
		display: flex;
		justify-content: center;
		position: relative;
	}

	button {
		position: absolute;
		width: fit-content;
		right: 0;
		bottom: 0;
	}

	table {
		height: fit-content;
		width: 100%;
		margin: 0;
		border: none;
	}
</style>
