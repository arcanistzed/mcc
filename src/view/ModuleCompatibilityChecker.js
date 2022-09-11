import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";

import ModuleCompatibilityCheckerShell from "./ModuleCompatibilityCheckerShell.svelte";

export class ModuleCompatibilityChecker extends SvelteApplication {
	/** @inheritDoc */
	constructor(options = {}) {
		super(options);

		try {
			// Attempt to parse session storage item and set application state
			this.state.set(JSON.parse(sessionStorage.getItem("mcc.appState")));
		} catch (err) {
			//
		}
	}

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			id: "mcc",
			title: "mcc.appTitle",
			classes: ["mcc"],
			width: Math.max(window.innerWidth * 2 / 3, 800),
			height: Math.max(window.innerHeight * 2 / 3, 580),
			resizable: true,
			minWidth: 800,
			minHeight: 580,

			svelte: {
				class: ModuleCompatibilityCheckerShell,
				target: document.body,
			},
		});
	}
}

globalThis.ModuleCompatibilityChecker = ModuleCompatibilityChecker;
