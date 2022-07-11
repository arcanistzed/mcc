<script>
	import { getContext } from "svelte";

	const filterSearch = getContext("spreadsheetStore").filterSearch;
</script>

<input type="search" bind:value={$filterSearch} placeholder="Search module compatibility..." />

<style>
	input[type="search"] {
		box-sizing: border-box;
		height: var(--form-field-height);
		background: rgba(0, 0, 0, 0.05);
		padding: 1ch;
		margin-bottom: 1ch;
		color: var(--color-text-dark-primary);
		font-family: inherit;
		font-size: inherit;
		border: 1px solid var(--color-border-light-tertiary);
		border-radius: 3px;
		user-select: text;
	}
</style>
