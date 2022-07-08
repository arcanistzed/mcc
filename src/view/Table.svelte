<script>
	import SpreadsheetController from "../controller/SpreadsheetController.js";
	import Versions from "./Versions.svelte";
	import PieChart from "./PieChart.svelte";
	import Details from "./Details.svelte";
	import Search from "./Search.svelte";
	import Header from "./Header.svelte";
	import Rows from "./Rows.svelte";
	import Footer from "./Footer.svelte";

	export let rows = [];
	export let versions;
	export let version;

	let details = false,
		search = "",
		mode;
</script>

<main>
	<header>
		<Versions bind:versions bind:version />
		<PieChart bind:rows />
		<Details bind:details />
	</header>
	<Search bind:search />
	<table>
		<Header bind:rows bind:details bind:mode />
		<Rows bind:rows bind:details bind:search />
	</table>
	<Footer bind:rows url={spreadsheetURL} status={SpreadsheetController.spreadsheetStatus}/>
</main>

<style>
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
