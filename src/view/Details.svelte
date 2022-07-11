<script>
	import { getContext } from "svelte";

	import { localize } from "../utils.js";

	const { details } = getContext("spreadsheetStore").stores;
</script>

<button on:click={() => ($details = !$details)}>
	{$details ? localize("hide") : localize("show")}
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
