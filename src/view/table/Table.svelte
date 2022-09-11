<script>
	import { getContext } from "svelte";

	import { applyScrolltop } from "@typhonjs-fvtt/runtime/svelte/action";

	import Reminder from "./Reminder.svelte"
	import PieChart from "../pie/PieChart.svelte";
	import StickyHeader from "./Controls.svelte";
	import Header from "./Header.svelte";
	import Rows from "./Rows.svelte";
	import Footer from "./Footer.svelte";

	const { scrollTop } = getContext("spreadsheetStore").stores;

	/**
	 * Handle CustomEvent from StickyHeader to smoothly scroll to the top.
	 * @param {CustomEvent} event
	 */
	function scrollSmooth(event) {
		event.currentTarget.scrollTo({ top: 0, left: 0, behavior: "smooth" });
		event.preventDefault();
		event.stopPropagation();
	}
</script>

<main use:applyScrolltop={scrollTop} on:scrollTop:smooth={scrollSmooth}>
	<Reminder />
	<PieChart />
	<StickyHeader />
	<div>
		<table>
			<Header />
			<Rows />
		</table>
	</div>
</main>
<Footer />

<style>
	div {
		flex: 1;
		background: rgba(0, 0, 0, 0.1);
	}

	main {
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
		overflow-x: hidden;
		position: relative;
		scrollbar-width: thin; /* For Firefox */
		color: var(--mcc-text-dark-color);
		padding: 0 1ch;
		margin-top: 1ch;
	}

	table {
		flex: 1;
		margin: 0;
		border: none;
		box-sizing: border-box;
		border-collapse: separate;
		border-spacing: 0;
	}
</style>
