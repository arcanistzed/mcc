<script>
	import { localize } from "../utils.js";

	export let details;
</script>

<button on:click={() => (details = !details)}>
	{details ? localize("hide") : localize("show")}
	{localize("details")}
</button>

<style>
	button {
		position: absolute;
		width: fit-content;
		right: 0;
		bottom: 0;
	}
</style>
