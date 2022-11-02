<script>
	import { getContext } from "svelte";

	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

	const spreadsheetStore = getContext("spreadsheetStore");
	const { pieData, statuses } = spreadsheetStore.stores;
</script>

<section>
	{#each $statuses as status, i (status.key)}
		<div class="entry" class:line-through={!status.value} on:click={() => statuses.toggleVisible(status.key)}>
			<span style:background-color={$pieData.datasets[0].backgroundColor[i]}>{$pieData.datasets[0].data[i]} / {$spreadsheetStore.index.length}</span>
			<a>{$pieData.labels[i]}</a>
		</div>
	{/each}
	<hr />
	<div class="links">
		<a on:click={statuses.setCompatibleVisible}>
			<i class="fas fa-thumbs-up" /> {localize("mcc.showCompatible")}
		</a>
		<a on:click={() => spreadsheetStore.resetFilters()}>
			<i class="fas fa-trash" /> {localize("mcc.resetFilters")}
		</a>
	</div>
</section>

<style>
	.line-through {
		text-decoration: line-through;
	}

	.entry {
		display: flex;
		gap: 1ch;
		align-items: center;
		padding: 0.5ch 0;
		cursor: pointer;
	}

	.entry a {
		width: 100%;
	}

	.links {
		display: flex;
		justify-content: space-evenly;
		padding: 1ch;
	}

	hr {
		width: 100%;
		margin: 1ch;
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	span {
		box-sizing: border-box;
		width: 5rem;
		border-radius: 0.5ch;
		text-align: center;
		border: solid 2px rgba(0, 0, 0, 0.4);
		white-space: nowrap;
		padding: 0 1ch;
	}
</style>
