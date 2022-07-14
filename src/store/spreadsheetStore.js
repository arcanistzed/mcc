import { derived, writable } from "svelte/store";

import { DynArrayReducer } from "@typhonjs-fvtt/runtime/svelte/store";
import { createFilterQuery } from "@typhonjs-fvtt/svelte-standard/store";

import SpreadsheetController from "../controller/SpreadsheetController.js";

import { mccSessionStorage } from "./mccSessionStorage.js";
import { createAccessorStore } from "./createAccessorStore.js";
import { filterHiddenStatuses } from "./filterHiddenStatuses.js";
import { filterStatuses } from "./filterStatuses.js";
import { sortByHeader } from "./sortByHeader.js";

import { statuses } from "../utils.js";

class SpreadsheetStore extends DynArrayReducer {
	/** @type {Map<string, PackageLinkData>} */
	#packageLinks = new Map();

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
		const filteredPercentage = derived(this, () => {
			let working = 0;

			for (const row of this) {
				if (row.status === "G" || row.status === "N") { working++; }
			}

			return parseFloat((100 * (working / Math.max(this.index.length, 1))).toFixed(2))
		});

		this.#stores = {
			details: mccSessionStorage.getStore("mcc.details", false),
			filteredPercentage,
			filterSearch: createFilterQuery(["title", "id"], { store: mccSessionStorage.getStore("mcc.search", "") }),
			hiddenStatuses: filterHiddenStatuses,
			percentage: writable(0),
			percentageTooltip: writable(''),
			pieData: writable({}),
			reversed: createAccessorStore(this, "reversed", false),
			scrollTop: mccSessionStorage.getStore("mcc.scrolltop", 0),
			sortBy: sortByHeader,
			statuses: filterStatuses,
			version: createAccessorStore(this, "version")
		}

		this.filters.add(this.#stores.filterSearch);
		this.filters.add(filterStatuses);
		this.sort.set(sortByHeader);
	}

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

	/**
	 * Parses and builds all package data for any links to show on context menu click.
	 */
	buildPackageLinks() {
		const packageList = SpreadsheetController.getModuleList();

		for (const data of packageList) {
			const packageData = data?.data;
			const id = packageData?.id ?? packageData?.name;
			const url = packageData?.url;

			if (id) { this.#packageLinks.set(id, { id, url }); }
		}
	}

	/**
	 * Returns the package link data for the given package ID.
	 *
	 * @param {string}	id - Package ID.
	 *
	 * @returns {PackageLinkData} Any package link data.
	 */
	getPackageLinks(id) {
		return this.#packageLinks.get(id);
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

		this.buildPackageLinks();

		return this.update();
	}
}

export const spreadsheetStore = new SpreadsheetStore();

/**
 * @typedef {object} PackageLinkData
 *
 * @property {string} id - Package name / id
 *
 * @property {string} [url] - Package URL.
 */

/**
 * @typedef {object} SpreadsheetStores
 *
 * @property {import("svelte/store").Writable<boolean>} details - Show hide additional details in table / rows.
 *
 * @property {import("svelte/store").Readable<number>} filteredPercentage - Stores current working percentage on
 *                                                                           filtered package data.
 *
 * @property {import("svelte/store").Writable<string>} filterSearch - Stores the filter search string.
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
 * @property {import("svelte/store").Readable<object[]>} statuses - Stores statuses visibility.
 *
 * @property {import("svelte/store").Writable<string>} version - Stores current spreadsheet version.
 */