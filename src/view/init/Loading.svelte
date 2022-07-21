<script>
	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
</script>

<main>
	<h3>{localize("mcc.loading")}</h3>
	<progress />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: auto;
		font-size: 2em;
		color: var(--mcc-text-dark-color);
	}

	h3 {
		font-size: 2em;
        text-align: center;
	}
</style>
