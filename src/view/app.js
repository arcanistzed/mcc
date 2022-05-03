import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import Shell from "./app.svelte";

export default class ModuleCompatibilityChecker extends SvelteApplication {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: "mcc.title",
			width: 300,

			svelte: {
				class: Shell,
				target: document.body,
			},
		});
	}
}
