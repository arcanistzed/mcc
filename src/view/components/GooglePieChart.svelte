<script>
	import { createEventDispatcher } from "svelte";

	import "@google-web-components/google-chart";

	const dispatch = createEventDispatcher();

	export let cols = [];
	export let rows = [];
	export let sliceVisibilityThreshold = 2.5 / 100;
</script>

<google-chart
	type="pie"
	{cols}
	{rows}
	options={{
		backgroundColor: "transparent",
		titleTextStyle: { fontSize: 14, color: "#737373" },
		sliceVisibilityThreshold,
	}}
	on:google-chart-select={e => {
		const selection = e.detail.chart.getSelection();
		dispatch("select", {
			selection,
			row: selection[0]?.row,
			value: rows[selection[0]?.row],
		});
	}}
/>

<style>
	google-chart {
		position: fixed;
		top: 2em;
		right: -2em;
		z-index: 1;
		clip-path: path("M0,10 340,10 340,190 245,190 245,235 0,235"); /* To not hide details button */
	}
</style>
