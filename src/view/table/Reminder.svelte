<script>
	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
</script>

<div class="notification">
	{localize("mcc.reminder")}
</div>

<style>
	.notification {
		margin: 1rem;
		text-shadow: none;
		background: var(--mcc-medium-color);
		border: 1px solid var(--mcc-dark-color);
	}

	.notification::before {
		content: "\f4c4";
	}
</style>
