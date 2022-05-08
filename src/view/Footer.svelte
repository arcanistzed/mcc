<script>
	import { fade } from "svelte/transition";
	import { localize } from "../utils.js";

	export let details = false;
	export let count;
	export let percentage;
	export let url;
</script>

<tfoot>
	<tr>
		<td transition:fade colspan={details ? 4 : 1}>{localize("report.count")}: {count}</td>
		<td transition:fade colspan={details ? 2 : 1}>{localize("report.percentage")}: {percentage}%</td>
		<td transition:fade>
			<a href={url}>
				{localize("source")}
				<i class="fa-solid fa-arrow-up-right-from-square" />
			</a>
		</td>
	</tr>
</tfoot>

<style scoped>
	tfoot {
		position: sticky;
		background-color: #555;
		bottom: 0;
		color: white;
		text-align: center;
	}

	a {
		color: white;
		white-space: nowrap;
	}
</style>
