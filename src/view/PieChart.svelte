<script>
	import { onMount, afterUpdate, onDestroy } from "svelte";
	import Chart from "chart.js/auto";
	import { statuses } from "../utils.js";

	export let rows = [];
	export let hiddenStatuses = [];

	let chart = null,
		chartRef,
		data;

	$: data = {
		labels: Object.values(statuses).map(({ explanation }) => explanation),
		datasets: [
			{
				data: Object.keys(statuses).map(status => rows.filter(row => row.status === status).length),
				backgroundColor: Object.values(statuses).map(
					({ hsl }) => `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 100%)`
				),
				hoverBackgroundColor: Object.values(statuses).map(
					({ hsl }) => `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] + 10}%, 80%)`
				),
			},
		],
	};

	Chart.defaults.font = {
		family: getComputedStyle(document.documentElement).getPropertyValue("--font-primary").trim(),
		size: 14,
	};

	onMount(() => {
		chart = new Chart(chartRef, {
			type: "pie",
			data,
			options: {
				responsive: true,
				maintainAspectRatio: true,
				layout: {
					padding: {
						bottom: 20,
					},
				},
				borderColor: "transparent",
			},
		});

		const original = chart.toggleDataVisibility;
		chart.toggleDataVisibility = function (index) {
			original.call(chart, index);
			hiddenStatuses = Object.entries(chart._hiddenIndices)
				.filter(i => i[1])
				.map(i => Object.keys(statuses)[i[0]]);
			chart.update();
		};
	});

	afterUpdate(() => {
		if (!chart) return;

		chart.data = data;
		chart.update();
	});

	onDestroy(() => {
		if (chart) chart.destroy();
		chart = null;
	});
</script>

<canvas bind:this={chartRef} style="max-height: 400px" />
