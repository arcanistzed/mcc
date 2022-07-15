import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

import SpreadsheetController from "./controller/SpreadsheetController.js";
import { statuses } from "./utils.js";

import PatreonButton from "./view/external/PatreonButton.svelte";
import ModuleManagementButton from "./view/external/ModuleManagementButton.svelte";

import "../styles/init.scss";

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


/**
 * Apply the status colors to the module management app
 * @param {ModuleManagement} app
 * @param {HTMLElement} html
 */
async function applyModuleManagementColors(app, html) {
	html.querySelector(".notes").textContent += localize("mcc.moduleManagementColorsExplanation");

	// Resize the app to fit the new contents
	app.setPosition();

	const version = (await SpreadsheetController.getVersions()).at(-1);
	const spreadsheet = await SpreadsheetController.getSpreadsheet(version);

	html.querySelectorAll("#module-list :is([data-module-id], [data-module-name])").forEach(el => {
		const module = game.modules.get(el.dataset.moduleId ?? el.dataset.moduleName);
		const { status } = SpreadsheetController.lookupCompatibility(spreadsheet, module);
		const { hsl } = statuses[status];
		el.style.backgroundColor = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 15%)`;
	});
}
