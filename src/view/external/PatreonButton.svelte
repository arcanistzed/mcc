<script>
import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="tag patreon" on:click={() => window.open("https://www.patreon.com/bePatron?u=15896855", "_blank")}>
	<i class="fab fa-patreon" />
	{localize("mcc.patreon")}
</span>

<style>
	.tag.patreon {
		background-color: hsl(357, 100%, 63%);
		transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1) 0s;
		cursor: pointer;
	}
	.tag.patreon:active {
		background-color: hsl(356, 100%, 58%);
	}
	.tag.patreon:hover {
		background-color: hsl(356, 100%, 60%);
	}
</style>
