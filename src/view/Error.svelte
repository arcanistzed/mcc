<script>
	import { isV10, localize } from "../utils.js";
	export let error = "";
</script>

<main>
	{#if isV10()}
		<i class="fas fa-warning" />
	{:else}
		<i class="fas fa-exclamation-triangle" />
	{/if}
	<pre>{error}</pre>
	<p>{localize("error")}</p>
	<a href="https://arcanist.me">
		{localize("website")}
		{#if isV10()}
			<i class="fa-solid fa-arrow-up-right-from-square" />
		{:else}
			<i class="fas fa-external-link-alt" />
		{/if}
	</a>
</main>

<style>
	main {
		padding: 1em;
		text-align: center;
		font-size: 1.5em;
	}

	.fa-warning,
	.fa-exclamation-triangle {
		font-size: 8em;
		color: #333;
	}

	a:hover {
		text-shadow: none;
	}
</style>
