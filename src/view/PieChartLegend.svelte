<script>
	import { getContext } from "svelte";

	import { localize } from "../utils.js";

	const spreadsheetStore = getContext("spreadsheetStore");
	const { filterSearch, pieData, statuses } = spreadsheetStore.stores;

	function resetFilters() {
		filterSearch.set('');
		statuses.reset();
	}

	// <i class="fas fa-ice-cream"></i>
</script>

<section>
	{#each $statuses as status, cntr (status.key)}
		<div class=entry
			 class:line-through={!status.value}
			 on:click={() => statuses.toggleVisible(status.key)}>
			<span style:background-color={$pieData.datasets[0].backgroundColor[cntr]}>
				{$pieData.datasets[0].data[cntr]} / {$pieData.allData[cntr]}
			</span>
			<a>{$pieData.labels[cntr]}</a>
		</div>
    {/each}
	<hr>
	<div class=links>
		<a class=links on:click={statuses.setKnownVisible}><i class="fas fa-thumbs-up"></i> {localize("showKnownPackages")}</a>
		<a class=links on:click={resetFilters}><i class="fas fa-trash"></i> {localize("resetAllFilters")}</a>
	</div>
</section>


<style>
	.line-through {
		text-decoration: line-through;
	}

	a.links {
		margin: 0.5em 1.5em 0 0;
		width: fit-content;
	}

	div.entry {
		display: flex;
		align-items: center;
		margin-bottom: 0.25em;
		cursor: pointer;
	}

	div.links {
		display: flex;
	}

	hr {
		width: 33em;
		margin: 0.5em 0 0 0;
		border-top: 1px solid #b5b3a4;
		border-bottom: 1px solid #f0f0e0;
	}

	section {
		display: flex;
		flex-direction: column;
		width: fit-content;
		margin-left: 1.5em;
		justify-content: center;
	}

	span {
		width: 6em;
		height: 1.5em;
		line-height: 1.25em;
		margin-right: 0.5em;
		text-align: center;
		border: 2px solid rgba(0, 0, 0, 0.4)
	}
</style>
