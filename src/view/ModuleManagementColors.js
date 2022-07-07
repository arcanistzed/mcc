import { statuses } from "../utils.js";
import SpreadsheetController from "../controller/SpreadsheetController.js";

/**
 * Apply the status colors to the module management window
 * @param {HTMLElement} html - The HTML element of the Module Management application
 */
export default async function applyModuleManagementColors(html) {
	const spreadsheet = await SpreadsheetController.getSpreadsheet();

	html.querySelectorAll("#module-list :is([data-module-id], [data-module-name])").forEach(el => {
		const module = game.modules.get(el.dataset.moduleId ?? el.dataset.moduleName);
		const { status } = SpreadsheetController.lookupCompatibility(spreadsheet, module);
		const { hsl } = statuses[status];
		el.style.backgroundColor = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 15%)`;
	});
}
