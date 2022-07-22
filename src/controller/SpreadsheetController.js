import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

import { statusData } from "../store/statusData.js";

/**
 * @typedef {object} RowData
 * @property {string} title - The title of the module
 * @property {string} type - The type of the module
 * @property {string} id - The ID of the module
 * @property {string} author - The author of the module
 * @property {string} version - The verified compatible version of the module
 * @property {keyof statusData} status - The status of the module
 * @property {string} notes - Any notes about the module
 *
 * @typedef {string[]} SpreadsheetRow
 * @typedef {SpreadsheetRow[]} Spreadsheet
 */

export default class SpreadsheetController {
	/**
	 * @type {string} The status of the spreadsheet
	 */
	static spreadsheetStatus;

	/**
	 * @type {string} The ID of the spreadsheet
	 */
	static spreadsheetID;

	/**
	 * Get the core versions that have spreadsheets
	 * @returns {Promise<string[]>} The versions available
	 */
	static async getVersions() {
		const response = await fetch("https://mcc.arcanist.workers.dev/api/versions");
		return await response.json();
	}

	/**
	 * Get the rows of the spreadsheet
	 * @param {string} version - The Foundry VTT core version of the spreadsheet to get
	 * @returns {Promise<RowData[]>} The rows of the spreadsheet
	 */
	static async getRows(version) {
		const spreadsheet = await this.getSpreadsheet(version);
		this.spreadsheetStatus = spreadsheet[0][0];
		const modules = this.getModuleList();
		const rows = modules.map(module => this.lookupCompatibility(spreadsheet, module));
		return rows;
	}

	/**
	 * Get the spreadsheet
	 * @param {string} version - The Foundry VTT core version of the spreadsheet to get
	 * @returns {Promise<Spreadsheet>} The spreadsheet
	 */
	static async getSpreadsheet(version) {
		const response = await fetch(`https://mcc.arcanist.workers.dev/?version=${version}`);
		this.spreadsheetID = response.headers.get("X-Spreadsheet-ID");
		return await response.json();
	}

	/**
	 * Get the list of modules
	 * @returns {ModuleData[]} The list of installed modules and the current game system
	 */
	static getModuleList() {
		return [game.system, ...game.modules.values()];
	}

	/**
	 * Lookup the compatibility of a module in the spreadsheet
	 * @param {Spreadsheet} spreadsheet - The spreadsheet
	 * @param {ModuleData} module - The module to lookup
	 * @returns {RowData} The row of compatibility data
	 */
	static lookupCompatibility(spreadsheet, module) {
		// Get fallback
		const {
			title,
			type = "module",
			authors: [{ name: authorName = "" } = {}],
			compatibleCoreVersion,
			compatibility: { verified = null } = {},
		} = module.data;
		const fallback = {
			title: title ?? localize("mcc.untitled"),
			type,
			id: module.id ?? module.name,
			author: authorName ?? module.author ?? localize("mcc.unknownAuthor"),
			version: verified ?? compatibleCoreVersion ?? "?",
			status: "U",
			notes: "",
		};

		// Get spreadsheet data
		const data = this.rowToData(spreadsheet.find(r => r[2] === (module.id ?? module.name)) ?? []);
		data.official = true;

		// Merge data
		for (const property in data) {
			if (property === "version") {
				data.version = isNewerVersion(data.version, fallback.version) ? data.version : fallback.version;
			}
			if (data[property] === undefined) {
				if (!["status", "notes"].includes(property)) data.official = false;
				data[property] = fallback[property];
			}
		}

		// Convert to upper case; just in case!
		if (typeof data.status === "string") {
			data.status = data.status.toUpperCase();
		}

		// Check for valid status. Warn if not found and append a note.
		if (!statusData[data.status]) {
			const message = `Error in spreadsheet: ${data.title} (${data.id}) has invalid status '${data.status}'. Please contact 'Anathema#3668' on Discord.`;

			console.warn(message);

			data.notes = message;
			data.status = "X";
		}

		return data;
	}

	/**
	 * Convert a spreadsheet row to a row of data
	 * @param {SpreadsheetRow} row - The spreadsheet row
	 * @returns {RowData} The row of data
	 */
	static rowToData(row) {
		/** @type {RowData} */
		const data = {},
			/** @type {Array<keyof RowData>} */
			headings = ["title", "type", "id", "author", "version", "status", "notes"];

		for (let i = 0; i < headings.length; i++) {
			data[headings[i]] = row?.[i];
		}
		return data;
	}
}
