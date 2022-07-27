import { derived, writable } from "svelte/store";

import { DynArrayReducer } from "@typhonjs-fvtt/runtime/svelte/store";
import { createFilterQuery } from "@typhonjs-fvtt/svelte-standard/store";

import SpreadsheetController from "../controller/SpreadsheetController.js";

import { createAccessorStore } from "./createAccessorStore.js";
import { filterActive } from "./filterActive.js";
import { filterStatuses } from "./filterStatuses.js";
import { mccSessionStorage } from "./mccSessionStorage.js";
import { sortByHeader } from "./sortByHeader.js";
import { statusData } from "./statusData.js";

class SpreadsheetStore extends DynArrayReducer {
	/** @type {Map<string, PackageLinkData>} */
	#packageLinks = new Map();

	/**
	 * Stores pie chart data; further data is initialized at runtime
	 * @type {PieChartData}
	 */
	#pieData = {
		datasets: [
			{
				backgroundColor: Object.values(statusData).map(
					({ hsl }) => `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 100%)`
				),
				hoverBackgroundColor: Object.values(statusData).map(
					({ hsl }) => `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] + 10}%, 80%)`
				),
			},
		],
	};

	/** @type {string} */
	#version;

	/** @type {string[]} */
	#versions = [];

	/** @type {SpreadsheetStores} */
	#stores;

	constructor() {
		super();

		/**
		 * Creates a derived store that calculates the current working percentage based on filtered packages
		 * @type {import("svelte/store").Readable<number>}
		 */
		const filteredPercentage = derived(this, () => {
			let working = 0;

			for (const row of this) {
				if (row.status === "G" || row.status === "N") {
					working++;
				}
			}

			return parseFloat((100 * (working / Math.max(this.index.length, 1))).toFixed(2));
		});

		this.#stores = {
			details: mccSessionStorage.getStore("mcc.details", false),
			active: filterActive,
			filteredPercentage,
			filterSearch: createFilterQuery(["title", "id"], { store: mccSessionStorage.getStore("mcc.search", "") }),
			pieData: writable({}),
			reversed: createAccessorStore(this, "reversed", false),
			scrollTop: mccSessionStorage.getStore("mcc.scrollTop", 0),
			sortBy: sortByHeader,
			statuses: filterStatuses,
			version: createAccessorStore(this, "version"),
		};

		this.filters.add(this.#stores.filterSearch);
		this.filters.add(filterActive);
		this.filters.add(filterStatuses);
		this.sort.set(sortByHeader);

		// Subscribe to updates and calculate pie chart data for filtered packages
		this.subscribe(() => {
			const filteredData = [...this];

			// Update pie chart data w/ filtered data.
			this.#pieData.datasets[0].data = Object.keys(statusData).map(
				status => filteredData.filter(row => row.status === status).length
			);

			this.#stores.pieData.set(this.#pieData);
		});
	}

	/**
	 * @returns {SpreadsheetStores} All child stores
	 */
	get stores() {
		return this.#stores;
	}

	/**
	 * @returns {string} Current spreadsheet version
	 */
	get version() {
		return this.#version;
	}

	/**
	 * @param {string} version New spreadsheet version
	 */
	set version(version) {
		this.#version = version;
	}

	/**
	 * @returns {string[]} All spreadsheet versions
	 */
	get versions() {
		return this.#versions;
	}

	/**
	 * Parses and builds all package data for any links to show on context menu click
	 */
	buildPackageLinks() {
		const packageList = SpreadsheetController.getModuleList();

		for (const data of packageList) {
			const packageData = data?.data;
			const id = packageData?.id ?? packageData?.name;
			const url = packageData?.url;

			if (id) {
				this.#packageLinks.set(id, { id, url });
			}
		}
	}

	/**
	 * Returns the package link data for the given package ID
	 * @param {string}	id - Package ID
	 * @returns {PackageLinkData} Any package link data
	 */
	getPackageLinks(id) {
		return this.#packageLinks.get(id);
	}

	/**
	 * Resets the search and status filters
	 */
	resetFilters() {
		this.#stores.filterSearch.set("");
		this.#stores.statuses.reset();
	}

	async update() {
		const data = await SpreadsheetController.getRows(this.#version);

		// Add all package data to pie chart data
		this.#pieData.allData = Object.keys(statusData).map(status => data.filter(row => row.status === status).length);

		this.setData(data);
	}

	async initialize() {
		this.#versions = await SpreadsheetController.getVersions();

		// Only set the version to the latest spreadsheet version if it isn't retrieved from session storage
		if (typeof this.#version !== "string" || !this.#versions.includes(this.#version)) {
			this.#stores.version.set(this.#versions.at(-1));
		}

		// Add pie chart label data
		this.#pieData.labels = Object.values(statusData).map(({ explanation }) => explanation);

		this.buildPackageLinks();

		return this.update();
	}
}

export const spreadsheetStore = new SpreadsheetStore();

/**
 * @typedef {object} PackageLinkData
 * @property {string} id - Package ID
 * @property {string} [url] - Package URL
 */

/**
 * @typedef {object} PieChartData
 * @property {number[]} allData - All status data calculated when the spreadsheet updates
 * @property {string[]} labels - All status labels
 * @property {object[]} datasets
 * @property {number[]} datasets.data
 * @property {string[]} datasets.backgroundColor
 * @property {string[]} datasets.hoverBackgroundColor
 */

/**
 * @typedef {object} SpreadsheetStores
 * @property {import("svelte/store").Writable<boolean>} details - Show or hide additional details in table
 * @property {import("svelte/store").Writable<boolean>} active - Whether or not only active packages are displayed
 * @property {import("svelte/store").Readable<number>} filteredPercentage - Stores current working percentage on filtered package data
 * @property {import("svelte/store").Writable<string>} filterSearch - Stores the filter search string
 * @property {import("svelte/store").Writable<number[]>} pieData - Stores Chart.js pie chart data
 * @property {import("svelte/store").Writable<boolean>} reversed - Stores DynArrayReducer reversed state
 * @property {import("svelte/store").Writable<number>} scrollTop - Stores scroll bar position
 * @property {import("svelte/store").Writable<string>} sortBy - Table header key to sort by
 * @property {import("svelte/store").Readable<object[]>} statuses - Stores statuses visibility
 * @property {import("svelte/store").Writable<string>} version - Stores current spreadsheet version
 */
