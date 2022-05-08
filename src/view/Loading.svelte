<script>
	import { localize } from "../utils.js";
</script>

<main>
	<p>{localize("loading")}</p>
	<progress />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: auto;
		font-size: 2em;
	}

	p {
		margin: 0;
		font-size: 2em;
	}
</style>
