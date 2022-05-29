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

	const statuses = {
		X: {
			hsl: [0, 100, 40],
			explanation: localize("statuses.x"),
		},
		O: {
			hsl: [45, 90, 60],
			explanation: localize("statuses.o"),
		},
		B: {
			hsl: [30, 90, 40],
			explanation: localize("statuses.b"),
		},
		G: {
			hsl: [120, 40, 50],
			explanation: localize("statuses.g"),
		},
		N: {
			hsl: [200, 60, 50],
			explanation: localize("statuses.n"),
		},
		A: {
			hsl: [0, 0, 50],
			explanation: localize("statuses.a"),
		},
		U: {
			hsl: [0, 0, 100],
			explanation: localize("statuses.u"),
		},
	};
</script>

<main>
	<header>
		<PieChart bind:rows {statuses} />
		<button on:click={() => (details = !details)}>
			{details ? localize("hide") : localize("show")}
			{localize("details")}
		</button>
	</header>
	<table>
		<Header bind:rows bind:details bind:mode />
		<Rows bind:rows bind:details {statuses} />
	</table>
	<Footer bind:rows url={spreadsheetURL} />
</main>

<style scoped>
	main {
		display: flex;
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
		margin-bottom: 1em;
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
		border: solid black 1px;
		border-bottom: none;
		box-sizing: border-box;
		border-collapse: separate;
		border-spacing: 0;
	}
</style>
