import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

/**
 * @typedef {{hsl: number[], readonly explanation: string}} StatusesEntry
 *
 * @type {{A: StatusesEntry, B: StatusesEntry, U: StatusesEntry, G: StatusesEntry, X: StatusesEntry, N: StatusesEntry, O: StatusesEntry}}
 */
export const statusData = {
	X: {
		hsl: [0, 100, 60],
		get explanation() { return localize("mcc.statuses.x"); }
	},
	O: {
		hsl: [45, 90, 60],
		get explanation() {	return localize("mcc.statuses.o"); }
	},
	B: {
		hsl: [30, 90, 40],
		get explanation() {	return localize("mcc.statuses.b"); }
	},
	G: {
		hsl: [120, 40, 50],
		get explanation() {	return localize("mcc.statuses.g"); }
	},
	N: {
		hsl: [200, 60, 50],
		get explanation() {	return localize("mcc.statuses.n"); }
	},
	A: {
		hsl: [0, 0, 50],
		get explanation() {	return localize("mcc.statuses.a"); },
	},
	U: {
		hsl: [0, 0, 100],
		get explanation() {	return localize("mcc.statuses.u"); },
	},
};
