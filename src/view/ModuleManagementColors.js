import { localize, statuses } from "../utils.js";
import SpreadsheetController from "../controller/SpreadsheetController.js";

/**
 * Apply the status colors to the module management app
 * @param {ModuleManagement} app
 * @param {HTMLElement} html
 */
export default async function applyModuleManagementColors(app, html) {
	html.querySelector(".notes").textContent += localize("moduleManagementColorsExplanation");

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
