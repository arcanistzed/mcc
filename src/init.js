import ModuleCompatibilityChecker from "./view/ModuleCompatibilityChecker.js";
import PatreonButton from "./view/PatreonButton.svelte";
import ModuleManagementButton from "./view/ModuleManagementButton.svelte";
import applyModuleManagementColors from "./view/ModuleManagementColors.js";

globalThis.ModuleCompatibilityChecker = ModuleCompatibilityChecker;

Hooks.on("renderModuleManagement", (app, [html]) => {
	applyModuleManagementColors(app, html);

	// Add a Patreon button next to this module
	new PatreonButton({
		target: html.querySelector(":is([data-module-id='mcc'], [data-module-name='mcc']) .package-overview"),
		anchor: html.querySelector(":is([data-module-id='mcc'], [data-module-name='mcc']) .tag"),
	});

	// Add a button to the bottom of the module management window
	new ModuleManagementButton({
		target: html.querySelector("footer"),
		anchor: html.querySelector("[name='deactivate']"),
	});
});
