import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";

import ModuleCompatibilityCheckerShell from "./ModuleCompatibilityCheckerShell.svelte";

export class ModuleCompatibilityChecker extends SvelteApplication {
	/** @inheritDoc */
	constructor(options = {}) {
		super(options);

		try {
			// Attempt to parse session storage item and set application state.
			this.state.set(JSON.parse(sessionStorage.getItem(`mcc.appstate`)));
		} catch (err) { /**/ }
	}

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			id: "mcc-main-app",
			title: "mcc.appTitle",
			classes: ["mcc"],
			width: 800,
			height: window.innerHeight * 0.75,
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
