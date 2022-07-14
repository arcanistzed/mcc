/**
 * Check if the core version is at least V10
 * @returns {boolean} - Whether the versions is sufficient
 */
export function isV10() {
	return game.release.generation >= 10;
}

/**
 * Localization helper
 * @param {string} key - A key to localize
 * @returns {string} - The localized result
 */
export function localize(key) {
	return game.i18n.localize(`mcc.${key}`);
}

/**
 * @typedef {{hsl: number[], readonly explanation: string}} StatusesEntry
 *
 * @type {{A: StatusesEntry, B: StatusesEntry, U: StatusesEntry, G: StatusesEntry, X: StatusesEntry, N: StatusesEntry, O: StatusesEntry}}
 */
export const statuses = {
	X: {
		hsl: [0, 100, 60],
		get explanation() { return localize("statuses.x"); }
	},
	O: {
		hsl: [45, 90, 60],
		get explanation() {	return localize("statuses.o"); }
	},
	B: {
		hsl: [30, 90, 40],
		get explanation() {	return localize("statuses.b"); }
	},
	G: {
		hsl: [120, 40, 50],
		get explanation() {	return localize("statuses.g"); }
	},
	N: {
		hsl: [200, 60, 50],
		get explanation() {	return localize("statuses.n"); }
	},
	A: {
		hsl: [0, 0, 50],
		get explanation() {	return localize("statuses.a"); },
	},
	U: {
		hsl: [0, 0, 100],
		get explanation() {	return localize("statuses.u"); },
	},
};
