<script>
	import { getContext, onDestroy, onMount } from "svelte";

	import Chart from "chart.js/auto";

	import PieChartLegend from "./PieChartLegend.svelte";

	const spreadsheetStore = getContext("spreadsheetStore");
	const { statuses, pieData } = spreadsheetStore.stores;
	const radius = 125;

	let chart = null,
		canvasEl;

	$: if (chart) {
		chart.data = $pieData;
		chart.update();
	}

	$: if (chart) {
		updateDataVisibility($statuses);
	}

	/**
	 * Update chart data visibility based on statuses store entries
	 * @param {StatusEntry[]} statusEntries - Status entries to update visibility for
	 */
	function updateDataVisibility(statusEntries) {
		for (let i = 0; i < statusEntries.length; i++) {
			chart[statusEntries[i].value ? "show" : "hide"](0, i);
		}
	}

	/**
	 * Determines if a point is inside the chart radius
	 * @param {number} x - X coord
	 * @param {number} y - Y coord
	 * @returns {boolean} - Whether the point is inside the chart radius
	 */
	function isInsideChart(x, y) {
		return Math.sqrt((x - radius) ** 2 + (-y + radius) ** 2) < radius;
	}

	onMount(() => {
		chart = new Chart(canvasEl, {
			type: "pie",
			data: $pieData,
			options: {
				aspectRatio: 1,
				borderColor: "transparent",
				layout: { padding: 0 },
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: { enabled: false },
				},
				responsive: false,
				onHover: event => {
					event.chart.canvas.style.cursor = isInsideChart(event.x, event.y) ? "pointer" : "default";
				},
			},
		});

		updateDataVisibility($statuses);
	});

	onDestroy(() => {
		if (chart) chart.destroy();
		chart = null;
	});

	function onClick(event) {
		const rect = canvasEl.getBoundingClientRect();

		// Check if the click is inside the chart by adjusting for the canvas bounding rect
		if (!isInsideChart(event.clientX - rect.left, event.clientY - rect.top)) {
			return;
		}

		const statusLength = $statuses.filter(status => status.value).length;

		if (statusLength <= 1) {
			statuses.reset();
			return;
		}

		const points = chart.getElementsAtEventForMode(event, "nearest", { intersect: true }, true);

		if (statusLength > 1 && points.length) {
			const firstPoint = points[0];
			statuses.setExclusive(firstPoint.index);
		}
	}
</script>

<section>
	<div>
		<canvas bind:this={canvasEl} on:click={onClick} width={radius * 2} height={radius * 2} />
	</div>
	<PieChartLegend />
</section>

<style>
	div {
		border-radius: 100%;
		box-shadow: 0 0 1ch rgba(0, 0, 0, 0.25);
		background-color: rgba(0, 0, 0, 0.05);
	}

	section {
		margin: 1ch;
		display: flex;
		gap: 2rem;
		justify-content: center;
	}
</style>
