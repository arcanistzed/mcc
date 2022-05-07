<script>
	import { localize } from "../../utils.js";
    export let error = "";
</script>

<main>
	<i class="fas fa-warning" />
	<pre>{error}</pre>
	<p>{localize("error")}</p>
	<a href="https://arcanist.me">
		{localize("website")}
		<i class="fa-solid fa-arrow-up-right-from-square" />
	</a>
</main>

<style>
    main {
        padding: 1em;
		text-align: center;
		font-size: 1.5em;
	}

	.fa-warning {
		font-size: 8em;
		color: #333;
	}

	a:hover {
		text-shadow: none;
	}
</style>
