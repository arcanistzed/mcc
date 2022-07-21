<script>
	import { getContext, onDestroy, onMount } from "svelte";

	import Chart from "chart.js/auto";

	import PieChartLegend from "./PieChartLegend.svelte";

	const spreadsheetStore = getContext("spreadsheetStore");
	const { statuses, pieData } = spreadsheetStore.stores;

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
	 * Update chart data visibility based on statuses store entries.
	 * @param {StatusEntry[]} statusEntries
	 */
	function updateDataVisibility(statusEntries) {
		for (let i = 0; i < statusEntries.length; i++) {
			chart[statusEntries[i].value ? "show" : "hide"](0, i);
		}
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
			},
		});

		updateDataVisibility($statuses);
	});

	onDestroy(() => {
		if (chart) chart.destroy();
		chart = null;
	});

	/**
	 * Convert click event on canvas to pie chart / status data field index and set statuses data exclusively to it.
	 * @param {MouseEvent} event
	 */
	function onCanvasClick(event) {
		const points = chart.getElementsAtEventForMode(event, "nearest", { intersect: true }, true);

		if (points.length) {
			const firstPoint = points[0];
			statuses.setExclusive(firstPoint.index);
		}
	}
</script>

<section>
	<div class=side />
	<div class=center>
		<div class=canvas>
			<canvas bind:this={canvasEl} on:click={onCanvasClick}/>
		</div>
		<PieChartLegend />
	</div>
	<div class=side />
</section>

<style>
	canvas {
		width: 250px;
		height: 250px;
		cursor: pointer;
	}

	div.canvas {
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.2);
		background: rgba(0, 0, 0, 0.1);
	}

	div.side {
		flex-grow: 1;
	}

	div.center {
		width: fit-content;
		display: flex;
	}

	section {
		margin: 1em 0;
		display: flex;
		justify-content: center;
		align-content: center;
	}
</style>
