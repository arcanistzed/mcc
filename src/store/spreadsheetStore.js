import { mmcSessionStorage } from "./mmcSessionStorage.js";

import SpreadsheetController from "../controller/SpreadsheetController.js";

class SpreadsheetStore {
	#data = [];

	/** @type {string} */
	#version;

	/** @type {string[]} */
	#versions = [];

	/**
	 * Stores the subscribers.
	 *
	 * @type {(function(T[]): void)[]}
	 */
	#subscriptions = [];

	/** @type {SpreadsheetStores} */
	#stores;

	constructor() {
		this.#stores = {
			details: mmcSessionStorage.getStore('mmc.details', false)
		}
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
		this.update();
	}

	async update() {
		this.#data = await SpreadsheetController.getRows(this.#version);
		this.#updateSubscribers();
	}

	async populate() {
		this.#versions = await SpreadsheetController.getVersions();
		this.#version ??= this.#versions.at(-1);

		return this.update();
	}

	set(data) {
		this.#data = data;
		this.#updateSubscribers();
	}

// -------------------------------------------------------------------------------------------------------------------

	/**
	 * @param {function(T[]): void} handler - Callback function that is invoked on update / changes.
	 *
	 * @returns {(function(): void)} Unsubscribe function.
	 */
	subscribe(handler) {
		this.#subscriptions.push(handler); // add handler to the array of subscribers

		handler(this.#data);                     // call handler with current value

		// Return unsubscribe function.
		return () => {
			const index = this.#subscriptions.findIndex((sub) => sub === handler);
			if (index >= 0) { this.#subscriptions.splice(index, 1); }
		};
	}

	/**
	 * Updates subscribers.
	 */
	#updateSubscribers() {
		for (let cntr = 0; cntr < this.#subscriptions.length; cntr++) {
			this.#subscriptions[cntr](this.#data);
		}
	}
}

export const spreadsheetStore = new SpreadsheetStore();

/**
 * @typedef {object} SpreadsheetStores
 *
 * @property {import("svelte/store").Writable<boolean>} details - Show hide additional details in table / rows.
 */