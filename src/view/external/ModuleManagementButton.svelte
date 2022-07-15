<script>
	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper"

    import { ModuleCompatibilityChecker } from "../ModuleCompatibilityChecker.js";

	const mccMainApp = new ModuleCompatibilityChecker();
</script>

<button on:click={() => mccMainApp.render(true, { focus: true })}>
    {localize("mcc.button")}
</button>