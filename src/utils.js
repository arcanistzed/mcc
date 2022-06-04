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
