import { localize } from "../utils.js";

export default class SpreadsheetController {
	static spreadsheetID = "1ppPR348igxL75M_G7dWl3otzXYpPwrnj7NVSDP8GmVw";

	static async getRows() {
		const spreadsheet = await this.getSpreadsheet();
		const modules = this.getPackageList();
		const rows = modules.map(module => this.lookupCompatibility(spreadsheet, module));
		return rows;
	}

	static async getSpreadsheet() {
		const RANGE = encodeURIComponent("A:N");
		const API_KEY = "AIzaSyBlU3Yx5abB9l71o1A7LfJ1ZAJytMtmuRM";
		const response = await fetch(
			`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetID}/values/${RANGE}?majorDimension=ROWS&key=${API_KEY}`
		);
		const json = await response.json();
		return json.values;
	}

	static getPackageList() {
		return [game.system.data ?? game.system, ...[...game.modules.values()].map(m => m.data)];
	}

	static lookupCompatibility(spreadsheet, module) {
		const current = module.id ?? module.name;

		// Get fallback
		const {
			title,
			type = "module",
			authors: [{ name: authorName } = {}],
			compatibleCoreVersion,
			compatibility: { verified } = {},
		} = module;
		const fallback = {
			title: title ?? localize("untitled"),
			type,
			id: current,
			author: authorName ?? module.author ?? localize("unknownAuthor"),
			version: verified ?? compatibleCoreVersion ?? "?",
			status: "U",
			notes: "",
		};

		// Get spreadsheet data
		const data = this.rowToObject(spreadsheet.find(r => r[2] === current));

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

	static rowToObject(row) {
		const headings = ["title", "type", "id", "author", "version", "status", "notes"],
			object = {};

		for (let i = 0; i < headings.length; i++) {
			object[headings[i]] = row?.[i];
		}
		return object;
	}
}
