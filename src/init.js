import ModuleCompatibilityChecker from "./view/ModuleCompatibilityChecker.js";
import PatreonButton from "./view/PatreonButton.svelte";
import ModuleManagementButton from "./view/ModuleManagementButton.svelte";

globalThis.ModuleCompatibilityChecker = ModuleCompatibilityChecker;

Hooks.on("renderModuleManagement", async (_app, [html]) => {
	new PatreonButton({
		target: html.querySelector("[data-module-id='mcc'] .package-overview"),
		anchor: html.querySelector("[data-module-id='mcc'] .tag"),
	});

	new ModuleManagementButton({
		target: html.querySelector("footer"),
		anchor: html.querySelector("[name='deactivate']"),
	});
});
