import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import ModuleCompatibilityCheckerShell from "./ModuleCompatibilityChecker.svelte";

export default class ModuleCompatibilityChecker extends SvelteApplication {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			id: "mcc-main-app",
			title: "mcc.appTitle",
			classes: ["mcc"],
			width: 775,
			height: window.innerHeight * 0.75,
			resizable: true,
			minWidth: 775,
			minHeight: 580,

			svelte: {
				class: ModuleCompatibilityCheckerShell,
				target: document.body,
			},
		});
	}
}
