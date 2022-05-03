export default class SpreadsheetController {
	static async getRows() {
		const spreadsheet = await this.getSpreadsheet();
		const rows = this.getModuleList()
			.map(module => this.lookupCompatibility(spreadsheet, module))
			.filter(row => row?.length);

		return rows;
	}

	static async getSpreadsheet() {
		const SPREADSHEET_ID = "1ppPR348igxL75M_G7dWl3otzXYpPwrnj7NVSDP8GmVw";
		const RANGE = encodeURIComponent("A:N");
		const API_KEY = "AIzaSyB3dDZsxNJYnIStss3pRAxdMow9BOtFFyY";
		const response = await fetch(
			`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?majorDimension=ROWS&key=${API_KEY}`
		);
		const json = await response.json();
		return json.values;
	}

	static getModuleList() {
		// FIXME Remove when core bug with active modules is fixed
		game.modules.get("scs").active = true;
		game.modules.get("_dev-mode").active = true;
		game.modules.get("lib-wrapper").active = true;

		const modules = game.modules.filter(m => m.active);
		return modules.map(m => m.id ?? m.name);
	}

	static lookupCompatibility(spreadsheet, module) {
		return spreadsheet.find(a => a[2] === module);
	}
}
