<script>
    import { localize } from "../utils.js";
    import ModuleCompatibilityChecker from "./ModuleCompatibilityChecker.js";

	const mmcMainApp = new ModuleCompatibilityChecker();
</script>

<button on:click={() => mmcMainApp.render(true, { focus: true })}>
    {localize("button")}
</button>