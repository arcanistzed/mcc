import ModuleCompatibilityChecker from "./view/ModuleCompatibilityChecker.js";
import PatreonButton from "./view/PatreonButton.svelte";
import ModuleManagementButton from "./view/ModuleManagementButton.svelte";
import applyModuleManagementColors from "./view/ModuleManagementColors.js";

globalThis.ModuleCompatibilityChecker = ModuleCompatibilityChecker;

Hooks.on("renderModuleManagement", async (_app, [html]) => {
	applyModuleManagementColors(html);

	new PatreonButton({
		target: html.querySelector(":is([data-module-id='mcc'], [data-module-name='mcc']) .package-overview"),
		anchor: html.querySelector(":is([data-module-id='mcc'], [data-module-name='mcc']) .tag"),
	});

	new ModuleManagementButton({
		target: html.querySelector("footer"),
		anchor: html.querySelector("[name='deactivate']"),
	});
});
