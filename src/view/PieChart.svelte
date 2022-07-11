<script>
	import { onMount, onDestroy, getContext } from "svelte";
	import Chart from "chart.js/auto";
	import { statuses, statusesIndexMap } from "../utils.js";

	const spreadsheetStore = getContext("spreadsheetStore");
	const { hiddenStatuses, pieData } = spreadsheetStore.stores;

	let chart = null,
		chartRef;

	Chart.defaults.font = {
		family: getComputedStyle(document.documentElement).getPropertyValue("--font-primary").trim(),
		size: 14,
	};

	$: if (chart) {
		chart.data = $pieData;
		chart.update();
	}

	onMount(() => {
		chart = new Chart(chartRef, {
			type: "pie",
			data: $pieData,
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

		// Set initial hidden statuses coming from session storage.
		for (const status of $hiddenStatuses) {
			chart.toggleDataVisibility(statusesIndexMap.get(status));
		}

		const original = chart.toggleDataVisibility;

		chart.toggleDataVisibility = function (index) {
			original.call(chart, index);
			$hiddenStatuses = Object.entries(chart._hiddenIndices)
				.filter(i => i[1])
				.map(i => Object.keys(statuses)[i[0]]);
			chart.update();
		};
	});

	onDestroy(() => {
		if (chart) chart.destroy();
		chart = null;
	});
</script>

<canvas bind:this={chartRef} style="max-height: 400px" />
