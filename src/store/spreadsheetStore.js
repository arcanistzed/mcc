import { derived, writable } from "svelte/store";

import { DynArrayReducer } from "@typhonjs-fvtt/runtime/svelte/store";
import { createFilterQuery } from "@typhonjs-fvtt/svelte-standard/store";

import SpreadsheetController from "../controller/SpreadsheetController.js";

import { mccSessionStorage } from "./mccSessionStorage.js";
import { createAccessorStore } from "./createAccessorStore.js";
import { filterHiddenStatuses } from "./filterHiddenStatuses.js";
import { sortByHeader } from "./sortByHeader.js";

import { statuses } from "../utils.js";

class SpreadsheetStore extends DynArrayReducer {
	#filterSearch = createFilterQuery(["title", "id"], { store: mccSessionStorage.getStore("mcc.search", "") });

	/** @type {string} */
	#version;

	/** @type {string[]} */
	#versions = [];

	/** @type {SpreadsheetStores} */
	#stores;

	constructor() {
		super();

		/**
		 * Creates a derived store that calculates the current working percentage based on filtered packages.
		 *
		 * @type {import("svelte/store").Readable<number>}
		 */
		const currentPercentage = derived(this, () => {
			let working = 0;

			for (const row of this) {
				if (row.status === "G" || row.status === "N") { working++; }
			}

			return parseFloat((100 * (working / Math.max(this.index.length, 1))).toFixed(2))
		});

		this.#stores = {
			currentPercentage,
			details: mccSessionStorage.getStore("mcc.details", false),
			hiddenStatuses: filterHiddenStatuses,
			percentage: writable(0),
			percentageTooltip: writable(''),
			pieData: writable({}),
			reversed: createAccessorStore(this, "reversed", false),
			scrollTop: mccSessionStorage.getStore("mcc.scrolltop", 0),
			sortBy: sortByHeader,
			version: createAccessorStore(this, "version")
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
	}

	async update() {
		const data = await SpreadsheetController.getRows(this.#version);

		this.setData(data);

		// Update percentage of working packages.
		const working = data.filter(row => row.status === "G" || row.status === "N").length;
		const known = data.filter(row => row.status !== "U").length;

		const percentageKnown = parseFloat((100 * (working / Math.max(known, 1))).toFixed(2));

		this.#stores.percentage.set(parseFloat((100 * (working / Math.max(data.length, 1))).toFixed(2)));

		this.#stores.percentageTooltip.set(game.i18n.format("mcc.percentageKnownTooltip", { known, percentageKnown }));

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

		// Only set the version to the latest / last spreadsheet version if it isn't retrieved from session storage.
		if (typeof this.#version !== 'string' || !this.#versions.includes(this.#version))
		{
			this.#stores.version.set(this.#versions.at(-1));
		}

		return this.update();
	}
}

export const spreadsheetStore = new SpreadsheetStore();

/**
 * @typedef {object} SpreadsheetStores
 *
 * @property {import("svelte/store").Readable<number>} currentPercentage - Stores current working percentage on
 *                                                                         filtered package data.
 *
 * @property {import("svelte/store").Writable<boolean>} details - Show hide additional details in table / rows.
 *
 * @property {import("svelte/store").Writable<string[]>} hiddenStatuses - Stores status codes to filter table data.
 *
 * @property {import("svelte/store").Writable<number>} percentage - Stores percentage of all compatible.
 *
 * @property {import("svelte/store").Writable<string>} percentageTooltip - Stores percentage tooltip w/ all & known data.
 *
 * @property {import("svelte/store").Writable<number[]>} pieData - Stores Chart.js / pie chart data.
 *
 * @property {import("svelte/store").Writable<boolean>} reversed - Stores DynArrayReducer reversed state.
 *
 * @property {import("svelte/store").Writable<number>} scrollTop - Stores scroll bar position.
 *
 * @property {import("svelte/store").Writable<string>} sortBy - Table header key to sort by.
 *
 * @property {import("svelte/store").Writable<string>} version - Stores current spreadsheet version.
 */