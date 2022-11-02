<script>
	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

	export let error = "";
	console.error(error);
</script>

<main>
	<i class="fas fa-exclamation-triangle" />
	<pre>{error}</pre>
	<p>{localize("mcc.error")}</p>
	<!-- svelte-ignore missing-declaration -->
	<a href={game.modules.get("mcc").data.bugs}>
		{localize("mcc.issues")}
		<i class="fas fa-external-link-alt" />
	</a>
</main>

<style>
	main {
		padding: 1em;
		text-align: center;
		font-size: 1.5em;
		color: var(--mcc-text-dark-color);
	}

	.fa-exclamation-triangle {
		font-size: 8em;
		color: var(--mcc-dark-color);
	}

	pre {
		white-space: normal;
	}
</style>
