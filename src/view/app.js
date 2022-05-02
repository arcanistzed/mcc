import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import Shell from "./app.svelte";

export default class ModuleCompatibilityChecker extends SvelteApplication {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: "mcc.title",
			width: 300,

			svelte: {
				class: Shell,
				target: document.body,
			},
		});
	}

	/** @override */
	async getData(options) {
		super.getData(options);

		const spreadsheet = await this.getSpreadsheet();
		const results = this.getModuleList()
			.map(module => this.lookupCompatibility(spreadsheet, module))
			.filter(row => row.length);
		
		return {
			results,
		};
	}

	async getSpreadsheet() {
		const SPREADSHEET_ID = "1ppPR348igxL75M_G7dWl3otzXYpPwrnj7NVSDP8GmVw";
		const RANGE = encodeURIComponent("A:N");
		const API_KEY = "AIzaSyB3dDZsxNJYnIStss3pRAxdMow9BOtFFyY";
		const response = await fetch(
			`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?majorDimension=ROWS&key=${API_KEY}`
		);
		const json = await response.json();
		return json.values;
	}

	getModuleList() {
		// FIXME Remove when core bug with active modules is fixed
		game.modules.get("mcc").active = true;
		game.modules.get("_dev-mode").active = true;

		const modules = game.modules.filter(m => m.active);
		return modules.map(m => m.id ?? m.name);
	}

	lookupCompatibility(spreadsheet, module) {
		return spreadsheet.find(a => a[2] === module);
	}
}
