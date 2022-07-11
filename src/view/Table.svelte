<script>
	import Versions from "./Versions.svelte";
	import PieChart from "./PieChart.svelte";
	import Details from "./Details.svelte";
	import Search from "./Search.svelte";
	import Header from "./Header.svelte";
	import Rows from "./Rows.svelte";
	import Footer from "./Footer.svelte";
</script>

<main>
	<header>
		<Versions />
		<PieChart />
		<Details />
	</header>
	<Search />
	<table>
		<Header />
		<Rows />
	</table>
	<Footer />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
		position: relative;
		margin: 1rem;
	}

	header {
		position: relative;
		margin-bottom: 1ch;
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
