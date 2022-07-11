import { mmcSessionStorage } from "./mmcSessionStorage.js";

/**
 * @param {SpreadsheetStore}	spreadsheetStore -
 *
 * @returns {import("svelte/store").Writable<boolean>}
 */
export function createReversed(spreadsheetStore)
{
	spreadsheetStore.reversed = mmcSessionStorage.getItem("mmc.reversed", false);

	const reversedStore = mmcSessionStorage.getStore("mmc.reversed", false);

	return {
		/**
		 * @param {(boolean) => void} handler
		 *
		 * @returns {import("svelte/store").Unsubscriber}
		 */
		subscribe: (handler) => reversedStore.subscribe(handler),

		/**
		 * @param {boolean} reversed -
		 */
		set: (reversed) => {
			spreadsheetStore.reversed = reversed;
			reversedStore.set(reversed);
		}
	}
}