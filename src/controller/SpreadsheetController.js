import { localize } from "../utils.js";

export default class SpreadsheetController {
	static spreadsheetID = "1ppPR348igxL75M_G7dWl3otzXYpPwrnj7NVSDP8GmVw";

	static async getRows() {
		// const spreadsheet = await this.getSpreadsheet();
		await new Promise(resolve => setTimeout(() => resolve(), 1000));
		const modules = this.getPackageList();
		const rows = modules.map(module => this.lookupCompatibility(/* spreadsheet */[], module));
		return rows;
	}

	static async getSpreadsheet() {
		const RANGE = encodeURIComponent("A:N");
		const API_KEY = "AIzaSyB3dDZsxNJYnIStss3pRAxdMow9BOtFFyY";
		const response = await fetch(
			`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetID}/values/${RANGE}?majorDimension=ROWS&key=${API_KEY}`
		);
		const json = await response.json();
		return json.values;
	}

	static getPackageList() {
		// FIXME Remove when core bug with active modules is fixed
		game.modules.forEach(m => (m.active = true));

		return [game.system, ...game.modules.filter(m => m.active && (m.name || m.id))];
	}

	static lookupCompatibility(spreadsheet, module) {
		const current = module.id ?? module.name;

		const {
			title,
			type,
			authors: [{ name: authorName }],
			compatibleCoreVersion,
		} = module;

		const data = this.rowToObject(spreadsheet.find(r => r[2] === current));

		const fallback = {
			title: title ?? localize("untitled"),
			type,
			id: current,
			author: authorName ?? localize("unknownAuthor"),
			version: compatibleCoreVersion ?? "?",
			status: Math.random() > 0.5 ? "G" :  Math.random() > 0.5 ? "X" : "U",
			notes: "",
		};

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
