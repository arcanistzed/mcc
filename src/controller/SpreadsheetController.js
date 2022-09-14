import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

import { statusData } from "../store/statusData.js";

const WORKER_URL = "https://mcc.arcanist.workers.dev";

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
		const response = await fetch(`${WORKER_URL}/api/versions`);
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
		const rows = modules.map(module => this.lookupCompatibility(spreadsheet, module, version));
		return rows;
	}

	/**
	 * Get the spreadsheet
	 * @param {string} version - The Foundry VTT core version of the spreadsheet to get
	 * @returns {Promise<Spreadsheet>} The spreadsheet
	 */
	static async getSpreadsheet(version) {
		const response = await fetch(`${WORKER_URL}/?version=${version}`);
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
	 * @param {string} version - The Foundry VTT core version of the spreadsheet
	 * @returns {RowData} The row of compatibility data
	 */
	static lookupCompatibility(spreadsheet, module, version) {
		// Get installed data
		const {
			title,
			type = "module",
			authors: [{ name: authorName = "" } = {}],
			compatibleCoreVersion,
			compatibility: { verified = null } = {},
		} = module.data;
		const installed = {
			title: title ?? localize("mcc.untitled"),
			type,
			id: module.id ?? module.name,
			author: authorName ?? module.author ?? localize("mcc.unknownAuthor"),
			verified: verified ?? compatibleCoreVersion ?? "?",
			status: "U",
			notes: "",
		};

		// Get spreadsheet data
		const data = this.rowToData(spreadsheet.find(r => r[2] === (module.id ?? module.name)) ?? []);
		data.official = true;

		// Merge data
		for (const property in data) {
			// Use the latest of the version numbers
			if (property === "version") {
				data.version = isNewerVersion(data.version, installed.verified) ? data.version : installed.verified;
			}
			// Mark the package as non-official if there is no status or notes
			if (!["status", "notes"].includes(property)) {
				data.official = false;
			}
			// Use the spreadsheet data for the title, author, or if there is no spreadsheet data for this property
			if (["title", "author"].includes(property) || data[property] === undefined) {
				data[property] = installed[property];
			}
		}

		// Convert to upper case
		if (typeof data.status === "string") {
			data.status = data.status.toUpperCase();
		}

		// No status is equivalent to "Unknown"
		if (data.status === "") {
			data.status = "U";
		}

		// If the status is unknown and the version is compatible with the current version, mark as compatible
		if (data.status === "U" && this.isCompatibleVersion(data.version, version)) {
			console.log(data.version);
			data.status = "C";
		}

		// Check for valid status and warn if not
		if (!statusData[data.status]) {
			const message = `Error in spreadsheet: ${data.title} (${data.id}) has an invalid status "${data.status}". Please contact Anathema#3668 on Discord.`;

			console.warn(message);

			data.notes = message;
			data.status = "X";
		}

		return data;
	}

	/**
	 * Compare if a given version is compatible with another version
	 * @param {string|number} v1 - The target version
	 * @param {string|number} v0 - The current version
	 * @returns {boolean} Whether v1 is compatible with v0
	 */
	static isCompatibleVersion(v1, v0 = game.release.version) {
		const v1Major = String(v1).split(".")[0];
		const v0Major = String(v0).split(".")[0];
		return v1Major === v0Major || isNewerVersion(v1Major, v0Major);
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
