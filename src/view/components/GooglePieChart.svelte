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
		margin: -4em -2em;
	}
</style>
