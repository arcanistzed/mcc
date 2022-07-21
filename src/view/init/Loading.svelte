<script>
	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
</script>

<main>
	<p>{localize("mcc.loading")}</p>
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

	p {
		margin: 0;
		font-size: 2em;
	}
</style>
