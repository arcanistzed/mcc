<script>
	import { getContext } from "svelte";

	import { applyScrolltop } from "@typhonjs-fvtt/runtime/svelte/action";

	import PieChart from "../pie/PieChart.svelte";
	import Header from "./Header.svelte";
	import Rows from "./Rows.svelte";
	import Footer from "./Footer.svelte";

	const { scrollTop } = getContext("spreadsheetStore").stores;

	/**
	 * Handle CustomEvent from StickyHeader to smoothly scroll to the top.
	 *
	 * @param {CustomEvent} event -
	 */
	function scrollSmooth(event) {
		event.currentTarget.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		event.preventDefault();
		event.stopPropagation();
	}
</script>

<main use:applyScrolltop={scrollTop} on:scrolltop:smooth={scrollSmooth}>
	<PieChart />
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
		overflow-x: hidden;
		position: relative;
		scrollbar-width: thin;  /* For Firefox */
		color: #191813;
	}

	table {
		height: fit-content;
		width: 100%;
		margin: 0;
		border: none;
		box-sizing: border-box;
		border-collapse: separate;
		border-spacing: 0;
	}
</style>
