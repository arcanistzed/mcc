import { writable } from "svelte/store";

import { DynArrayReducer } from "@typhonjs-fvtt/runtime/svelte/store";

import SpreadsheetController from "../controller/SpreadsheetController.js";
import { mmcSessionStorage } from "./mmcSessionStorage.js";
import { filterHiddenStatuses } from "./filterHiddenStatuses.js";
import { sortByHeader } from "./sortByHeader.js";
import { statuses } from "../utils.js";

import { createFilterQuery } from "./createFilterQuery.js";

class SpreadsheetStore extends DynArrayReducer {
	#filterSearch = createFilterQuery(["title", "id"]);

	/** @type {string} */
	#version;

	/** @type {string[]} */
	#versions = [];

	/** @type {SpreadsheetStores} */
	#stores;

	constructor() {
		super([]);

		this.#stores = {
			details: mmcSessionStorage.getStore('mmc.details', false),
			hiddenStatuses: filterHiddenStatuses,
			percentage: writable(0),
			pieData: writable({}),
			sortBy: sortByHeader
		}

		this.filters.add(this.#filterSearch);
		this.filters.add(filterHiddenStatuses);
		this.sort.set(sortByHeader);
	}

	get filterSearch() { return this.#filterSearch; }

	/**
	 * @returns {SpreadsheetStores}
	 */
	get stores() { return this.#stores; }

	/**
	 * @returns {string}
	 */
	get version() {
		return this.#version;
	}

	/**
	 * @returns {string[]}
	 */
	get versions() {
		return this.#versions;
	}

	/**
	 * @param {string} version -
	 */
	set version(version) {
		this.#version = version;

		// TODO: consider try / catch block and error mechanism on any lookup failures when version changes.
		this.update();
	}

	async update() {
		const data = await SpreadsheetController.getRows(this.#version);

		this.setData(data);

		// Update percentage of working packages.
		const working = data.filter(row => row.status === "G" || row.status === "N").length;
		const known = data.filter(row => row.status !== "U").length;

		this.#stores.percentage.set(parseFloat((100 * (working / Math.max(known, 1))).toFixed(2)));

		// Create the pie chart data.
		this.#stores.pieData.set({
			labels: Object.values(statuses).map(({ explanation }) => explanation),
			datasets: [
				{
					data: Object.keys(statuses).map(status => data.filter(row => row.status === status).length),
					backgroundColor: Object.values(statuses).map(
					 ({ hsl }) => `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 100%)`
					),
					hoverBackgroundColor: Object.values(statuses).map(
					 ({ hsl }) => `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] + 10}%, 80%)`
					)
				}
			]
		});
	}

	async initialize() {
		this.#versions = await SpreadsheetController.getVersions();
		this.#version ??= this.#versions.at(-1);

		return this.update();
	}
}

export const spreadsheetStore = new SpreadsheetStore();

/**
 * @typedef {object} SpreadsheetStores
 *
 * @property {import("svelte/store").Writable<boolean>} details - Show hide additional details in table / rows.
 *
 * @property {import("svelte/store").Writable<string[]>} hiddenStatuses - Stores status codes to filter table data.
 *
 * @property {import("svelte/store").Writable<string>} percentage - Stores percentage of known compatible.
 *
 * @property {import("svelte/store").Writable<number[]>} pieData - Stores Chart.js / pie chart data.
 *
 * @property {import("svelte/store").Writable<string>} sortBy - Table header key to sort by.
 */