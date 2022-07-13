import { mccSessionStorage } from "./mccSessionStorage.js";

// Get initial value from session storage immediately.
let sortBy = mccSessionStorage.getItem("mcc.sortBy", "");

const storeSortBy = mccSessionStorage.getStore("mcc.sortBy", "");

/**
 * Provides the compare function to sort macros by name alphabetically.
 *
 * @param {object} a -
 *
 * @param {object} b -
 *
 * @returns {number} sort order
 */
function sortByHeader(a, b)
{
	return sortBy && a?.[sortBy] && b?.[sortBy] ? a[sortBy].localeCompare(b[sortBy]) : 0;
}

// Create a custom store that changes when table header clicked.
sortByHeader.subscribe = (handler) => storeSortBy.subscribe(handler);

sortByHeader.set = (value) =>
{
	sortBy = value;
	storeSortBy.set(sortBy);
};

export { sortByHeader };