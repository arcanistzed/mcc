<script>
	/*
	This component creates a custom legend for the pie chart displaying all currently filtered status state along with two links to set status state to all known entries and reset all filters.
	*/
	import { getContext } from "svelte";

	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

	const spreadsheetStore = getContext("spreadsheetStore");
	const { pieData, statuses } = spreadsheetStore.stores;
</script>

<section>
	{#each $statuses as status, i (status.key)}
		<div class="entry" class:line-through={!status.value} on:click={() => statuses.toggleVisible(status.key)}>
			<span style:background-color={$pieData.datasets[0].backgroundColor[i]}>
				{$pieData.datasets[0].data[i]} / {$pieData.allData[i]}
			</span>
			<a>{$pieData.labels[i]}</a>
		</div>
	{/each}
	<hr />
	<div class="links">
		<a class="links" on:click={statuses.setKnownVisible}
			><i class="fas fa-thumbs-up" /> {localize("mcc.showKnownCompatible")}</a
		>
		<a class="links" on:click={() => spreadsheetStore.resetFilters()}
			><i class="fas fa-trash" /> {localize("mcc.resetFilters")}</a
		>
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
