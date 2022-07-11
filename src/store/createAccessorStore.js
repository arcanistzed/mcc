import { hasSetter } from "@typhonjs-fvtt/runtime/svelte/util";

import { mmcSessionStorage } from "./mmcSessionStorage.js";

/**
 * Creates a session storage store and link it to an accessor / setter on the given target.
 *
 * @template T
 *
 * @param {object} target - Target object
 *
 * @param {string} accessor - The accessor property to set.
 *
 * @param {T} [initial] - An initial default value.
 *
 * @returns {import("svelte/store").Writable<T>}
 */
export function createAccessorStore(target, accessor, initial)
{
	if (!hasSetter(target, accessor)) { throw new TypeError(`Accessor '${accessor} is not available on target.`); }

	const sessionKey = `mmc.${accessor}`;

	target[accessor] = mmcSessionStorage.getItem(sessionKey, initial);

	const mmcSessionStore = mmcSessionStorage.getStore(sessionKey, initial);

	return {
		/**
		 * @param {(T) => void} handler
		 *
		 * @returns {import("svelte/store").Unsubscriber}
		 */
		subscribe: (handler) => mmcSessionStore.subscribe(handler),

		/**
		 * @param {T} value -
		 */
		set: (value) => {
			target[accessor] = value;
			mmcSessionStore.set(value);
		}
	}
}