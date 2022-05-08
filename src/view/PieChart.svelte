<script>
	import Pie from "svelte-chartjs/src/Pie.svelte";

    export let data = [];
</script>

<Pie
	height={200}
	data={{
		labels: data.map(({ label }) => label),
		datasets: [
			{
				data: data.map(({ value }) => value),
				backgroundColor: data.map(({ hue }) => `hsl(${hue}, 50%, 50%)`),
				hoverBackgroundColor: data.map(({ hue }) => `hsl(${hue}, 50%, 60%)`),
			},
		],
	}}
	options={{
		responsive: true,
		maintainAspectRatio: false,
	}}
/>
