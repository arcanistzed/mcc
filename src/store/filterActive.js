import { mccSessionStorage } from "./mccSessionStorage.js";

// Get initial value from session storage immediately
let active = mccSessionStorage.getItem("mcc.active", false);

const storeActive = mccSessionStorage.getStore("mcc.active", active);

/**
 * Provides a filter function to only show rows that are for active packages
 * @param {RowData} row
 * @returns {boolean} filtered
 */
function filterActive(row) {
	return !active || game.modules.get(row.id)?.active;
}

// Create a custom store that changes when the active store changes
filterActive.subscribe = handler => storeActive.subscribe(handler);

filterActive.set = value => {
	active = value;
	storeActive.set(value);
};

export { filterActive };
