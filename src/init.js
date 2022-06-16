import ModuleCompatibilityChecker from "./view/ModuleCompatibilityChecker.js";
import PatreonButton from "./view/PatreonButton.svelte";

Hooks.once("ready", () => new ModuleCompatibilityChecker().render(true, { focus: true }));
globalThis.ModuleCompatibilityChecker = ModuleCompatibilityChecker;

Hooks.on("renderModuleManagement", (app, [html]) => {
    console.log(html);
    new PatreonButton({
		target: html.querySelector("[data-module-id='mcc'] .package-overview"),
		anchor: html.querySelector("[data-module-id='mcc'] .tag"),
	});
});
