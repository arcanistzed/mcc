<script>
	import { onMount, onDestroy, getContext } from "svelte";

	import Chart from "chart.js/auto";

	import PieChartLegend from "./PieChartLegend.svelte";

	const spreadsheetStore = getContext("spreadsheetStore");
	const { statuses, pieData } = spreadsheetStore.stores;

	let chart = null, canvasEl;

	$: if (chart) {
		chart.data = $pieData;
		chart.update();
	}

	$: if (chart) { updateDataVisibility($statuses); }

	function updateDataVisibility(statusArray)
	{
		for (let cntr = 0; cntr < statusArray.length; cntr++)
		{
			chart[statusArray[cntr].value ? 'show' : 'hide'](0, cntr);
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
					tooltip: { enabled: false }
				},
				responsive: false
			},
		});

		updateDataVisibility($statuses);
	});

	onDestroy(() => {
		if (chart) chart.destroy();
		chart = null;
	});

	function onCanvasClick(event) {
		const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

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
