<script>
    import { localize } from "../utils.js";
    import ModuleCompatibilityChecker from "./ModuleCompatibilityChecker.js";
</script>

<button on:click={() => new ModuleCompatibilityChecker().render(true, { focus: true })}>
    { localize("button")}
</button>