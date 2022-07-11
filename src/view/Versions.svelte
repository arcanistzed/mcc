<script>
	import { getContext } from "svelte";

	import { localize } from "../utils.js";

	const spreadsheetStore = getContext("spreadsheetStore");
</script>

<label>
	{localize("selectVersion")}
	<select bind:value={spreadsheetStore.version}>
		{#each spreadsheetStore.versions as version}
			<option value={version}>V{version}</option>
		{/each}
	</select>
</label>

<style>
	label {
		position: absolute;
		width: fit-content;
		left: 0;
		bottom: 0;
	}
</style>
