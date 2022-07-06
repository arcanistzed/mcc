// eslint-disable-next-line no-unused-vars
import { localize, statuses } from "../utils.js";

/**
 * @typedef {object} RowData
 * @property {string} title - The title of the module
 * @property {string} type - The type of the module
 * @property {string} id - The ID of the module
 * @property {string} author - The author of the module
 * @property {string} version - The verified compatible version of the module
 * @property {keyof statuses} status - The status of the module
 * @property {string} notes - Any notes about the module
 *
 * @typedef {string[]} SpreadsheetRow
 * @typedef {SpreadsheetRow[]} Spreadsheet
 */

export default class SpreadsheetController {
	/**
	 * @returns {string} A Google Spreadsheets ID
	 * @throws {Error} If this is not an explicitly supported generation of Foundry VTT
	 */
	static get spreadsheetID() {
		switch (game.release.generation) {
			case 9:
				return "1ppPR348igxL75M_G7dWl3otzXYpPwrnj7NVSDP8GmVw";
			case 10:
				return "14PHGJzvjhX19rzSHD7VNXtq9UZne4pUxnBn4bxvoM9k";
			default:
				throw new Error(`Unsupported Foundry VTT version ${game.release.generation}`);
		}
	}

	/**
	 * Get the rows of the spreadsheet
	 * @returns {Promise<RowData[]>} The rows of the spreadsheet
	 */
	static async getRows() {
		const spreadsheet = await this.getSpreadsheet();
		const modules = this.getModuleList();
		const rows = modules.map(module => this.lookupCompatibility(spreadsheet, module));
		return rows;
	}

	/**
	 * Get the spreadsheet
	 * @returns {Promise<Spreadsheet>} The spreadsheet
	 */
	static async getSpreadsheet() {
		const RANGE = encodeURIComponent("A:N");
		const API_KEY = "AIzaSyBlU3Yx5abB9l71o1A7LfJ1ZAJytMtmuRM";
		const response = await fetch(
			`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetID}/values/${RANGE}?majorDimension=ROWS&key=${API_KEY}`
		);
		const json = await response.json();
		return json.values;
	}

	/**
	 * Get the list of modules
	 * @returns {ModuleData[]} The list of installed modules and the current game system
	 */
	static getModuleList() {
		return [game.system.data ?? game.system, ...[...game.modules.values()].map(m => m.data)];
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
		} = module;
		const fallback = {
			title: title ?? localize("untitled"),
			type,
			id: module.id ?? module.name,
			author: authorName ?? module.author ?? localize("unknownAuthor"),
			version: verified ?? compatibleCoreVersion ?? "?",
			status: "U",
			notes: "",
		};

		// Get spreadsheet data
		const data = this.rowToData(spreadsheet.find(r => r[2] === (module.id ?? module.name)) ?? []);

		// Merge data
		for (const property in data) {
			if (property === "version") {
				data.version = isNewerVersion(data.version, fallback.version) ? data.version : fallback.version;
			}
			if (data[property] === undefined) {
				data[property] = fallback[property];
			}
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
