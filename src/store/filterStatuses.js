import { writable } from "svelte/store";

import { mccSessionStorage } from "./mccSessionStorage.js";
import { statusData } from "./statusData.js";

/**
 * Get initial value from session storage immediately.
 * @type {StatusEntry}
 */
const statuses = mccSessionStorage.getItem("mcc.statuses", Object.keys(statusData).map(key => ({ key, value: true })));

const storeStatuses = writable(statuses);

storeStatuses.getVisible = key => {
	const index = statuses.findIndex(entry => entry.key === key);
	return index >= 0 ? statuses[index].value : void 0;
};

storeStatuses.setExclusive = index => {
	if (index >= 0 && index < statuses.length) {
		for (const status of statuses) {
			status.value = false;
		}

		statuses[index].value = true;

		mccSessionStorage.setItem("mcc.statuses", statuses);
		storeStatuses.set(statuses);
	}
};

storeStatuses.setCompatibleVisible = () => {
	for (const status of statuses) {
		status.value = false;
	}

	statuses[3].value = true;
	statuses[4].value = true;
	statuses[7].value = true;

	mccSessionStorage.setItem("mcc.statuses", statuses);
	storeStatuses.set(statuses);
};

storeStatuses.setVisible = (key, value) => {
	const index = statuses.findIndex(entry => entry.key === key);

	if (index >= 0) {
		statuses[index].value = value;
		mccSessionStorage.setItem("mcc.statuses", statuses);
		storeStatuses.set(statuses);
	}
};

storeStatuses.toggleVisible = key => {
	const index = statuses.findIndex(entry => entry.key === key);

	if (index >= 0) {
		statuses[index].value = !statuses[index].value;
		mccSessionStorage.setItem("mcc.statuses", statuses);
		storeStatuses.set(statuses);
	}
};

storeStatuses.reset = () => {
	for (const status of statuses) {
		status.value = true;
	}
	mccSessionStorage.setItem("mcc.statuses", statuses);
	storeStatuses.set(statuses);
};

/**
 * Provides a filter function to remove rows that are part of hidden statuses set
 * @param {RowData} row
 * @returns {boolean} filtered
 */
function filterStatuses(row) {
	return storeStatuses.getVisible(row.status) ?? false;
}

// Create a custom store that changes when hidden statuses changes
filterStatuses.subscribe = handler => storeStatuses.subscribe(handler);

filterStatuses.getVisible = storeStatuses.getVisible;
filterStatuses.reset = storeStatuses.reset;
filterStatuses.setExclusive = storeStatuses.setExclusive;
filterStatuses.setCompatibleVisible = storeStatuses.setCompatibleVisible;
filterStatuses.setVisible = storeStatuses.setVisible;
filterStatuses.toggleVisible = storeStatuses.toggleVisible;

export { filterStatuses };

/**
 * @typedef {object} StatusEntry
 * @property {keyof statusData} key - Status key
 * @property {boolean} value - Status enabled state
 */
