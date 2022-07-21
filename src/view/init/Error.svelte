<script>
	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

	export let error = "";
	console.error(error);
</script>

<main>
	<i class="fas fa-exclamation-triangle" />
	<pre>{error}</pre>
	<p>{localize("mcc.error")}</p>
	<a href="https://arcanist.me">
		{localize("mcc.website")}
		<i class="fas fa-external-link-alt" />
	</a>
</main>

<style>
	main {
		padding: 1em;
		text-align: center;
		font-size: 1.5em;
		color: #191813;
	}

	.fa-exclamation-triangle {
		font-size: 8em;
		color: #333;
	}

	a:hover {
		text-shadow: none;
	}
</style>
