import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import ModuleCompatibilityCheckerShell from "./ModuleCompatibilityChecker.svelte";

export default class ModuleCompatibilityChecker extends SvelteApplication {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: "mcc.appTitle",
			classes: ["mcc"],
			width: window.innerWidth * 0.5,
			height: window.innerHeight * 0.95,
			resizable: true,

			svelte: {
				class: ModuleCompatibilityCheckerShell,
				target: document.body,
			},
		});
	}
}
