import { mccSessionStorage } from "./mccSessionStorage.js";

// Get initial value from session storage immediately.
let hiddenStatuses = new Set(mccSessionStorage.getItem('mcc.hiddenStatuses', []));

const storeHiddenStatuses = mccSessionStorage.getStore('mcc.hiddenStatuses', []);

/**
 * Provides a filter function to remove rows that are part of hidden statuses set.
 *
 * @param {object} row -
 *
 * @returns {boolean} filtered
 */
function filterHiddenStatuses(row)
{
	return !hiddenStatuses.has(row.status);
}

// Create a custom store that changes when hidden statuses changes.
filterHiddenStatuses.subscribe = (handler) => storeHiddenStatuses.subscribe(handler);

filterHiddenStatuses.set = (value) =>
{
	hiddenStatuses = new Set(value);
	storeHiddenStatuses.set(value);
};

export { filterHiddenStatuses };