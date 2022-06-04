import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import ModuleCompatibilityCheckerShell from "./ModuleCompatibilityChecker.svelte";
import PatreonButton from "./PatreonButton.svelte";

export default class ModuleCompatibilityChecker extends SvelteApplication {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: "mcc.appTitle",
			classes: ["mcc"],
			width: window.innerWidth * 0.75,
			height: window.innerHeight * 0.75,
			resizable: true,

			svelte: {
				class: ModuleCompatibilityCheckerShell,
				target: document.body,
			},
		});
	}

	/** @inheritdoc */
	_getHeaderButtons() {
		const buttons = super._getHeaderButtons();
		buttons.unshift(PatreonButton);
		return buttons;
	}
}
