import { mccSessionStorage } from "./mccSessionStorage.js";

// Get initial value from session storage immediately.
let sortBy = mccSessionStorage.getItem("mcc.sortBy", "");

const storeSortBy = mccSessionStorage.getStore("mcc.sortBy", "");

/**
 * Provides the compare function to sort packages
 * @param {object} a
 * @param {object} b
 * @returns {number} sort order
 */
function sortByHeader(a, b) {
	if (sortBy && a?.[sortBy] && b?.[sortBy]) {
		if (sortBy === "version") {
			return foundry.utils.isNewerVersion(a.version, b.version) ? 1 : -1;
		}
		return a[sortBy].localeCompare(b[sortBy]);
	}
	return 0;
}

// Create a custom store that changes when a table header clicked
sortByHeader.subscribe = handler => storeSortBy.subscribe(handler);

sortByHeader.set = value => {
	sortBy = value;
	storeSortBy.set(sortBy);
};

export { sortByHeader };
