<script>
	import { localize } from "../utils.js";

	export let versions;
	export let version;
</script>

<label>
	{localize("selectVersion")}
	<select bind:value={version}>
		{#each versions as version}
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
