import { hasSetter } from "@typhonjs-fvtt/runtime/svelte/util";

import { mccSessionStorage } from "./mccSessionStorage.js";

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
 * @returns {import("svelte/store").Writable<T>} An accessor store.
 */
export function createAccessorStore(target, accessor, initial) {
	if (!hasSetter(target, accessor)) { throw new TypeError(`Accessor '${accessor} is not available on target.`); }

	const sessionKey = `mcc.${accessor}`;

	target[accessor] = mccSessionStorage.getItem(sessionKey, initial);

	const mccSessionStore = mccSessionStorage.getStore(sessionKey, initial);

	return {
		/**
		 * @param {(T) => void} handler
		 *
		 * @returns {import("svelte/store").Unsubscriber} Unsubscriber
		 */
		subscribe: handler => mccSessionStore.subscribe(handler),

		/**
		 * @param {T} value -
		 */
		set: value => {
			target[accessor] = value;
			mccSessionStore.set(value);
		}
	};
}