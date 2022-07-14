<script>
	import { getContext } from "svelte";

	import { localize } from "../utils.js";

	const spreadsheetStore = getContext("spreadsheetStore");
	const { filterSearch, pieData, statuses } = spreadsheetStore.stores;

	function resetFilters() {
		filterSearch.set('');
		statuses.reset();
	}
</script>

<section>
	  {#each $statuses as status, cntr (status.key)}
		  <div class=entry
			   class:line-through={!status.value}
			   on:click={() => statuses.toggleVisible(status.key)}>
			  <span style:background-color={$pieData.datasets[0].backgroundColor[cntr]}>
				  {$pieData.datasets[0].data[cntr]}
			  </span>
			  {$pieData.labels[cntr]}
		  </div>
      {/each}
	  <a on:click={resetFilters}><i class="fas fa-trash"></i> {localize("resetAllFilters")}</a>
</section>


<style>
	.line-through {
		text-decoration: line-through;
	}

	a {
		margin-top: 0.75em;
	}

	div.entry {
		display: flex;
		align-items: center;
		margin-bottom: 0.25em;
	}

	section {
		display: flex;
		flex-direction: column;
		width: fit-content;
		margin-left: 2em;
		justify-content: center;
	}

	span {
		width: 3em;
		height: 1.5em;
		line-height: 1.25em;
		margin-right: 0.25em;
		text-align: center;
		border: 2px solid rgba(0, 0, 0, 0.4)
	}
</style>
