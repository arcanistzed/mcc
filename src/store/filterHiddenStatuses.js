import { mmcSessionStorage } from "./mmcSessionStorage.js";

// Get initial value from session storage immediately.
let hiddenStatuses = new Set(sessionStorage.getItem('mmc.hiddenStatuses') ?? []);

const storeHiddenStatuses = mmcSessionStorage.getStore('mmc.hiddenStatuses', []);

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