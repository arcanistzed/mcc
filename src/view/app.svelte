<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";

	export let elementRoot;
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
	<main>
		
	</main>
</ApplicationShell>

<style lang="scss">
</style>
