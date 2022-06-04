<script>
	import Pie from "svelte-chartjs/src/Pie.svelte";

	export let statuses = [];
	export let rows = [];
</script>

<Pie
	style="max-height: 400px;"
	data={{
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
	}}
	options={{
		responsive: true,
		maintainAspectRatio: true,
	}}
/>
