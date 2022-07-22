<script>
	/**
	 * This component hooks up several stores to input components including the spreadsheet version selection,
	 * search filter, showing / hiding package details, and dispatches a CustomEvent to smoothly scroll the table to
	 * top.
	 */
	import { getContext } from "svelte";
	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
	import { ripple, rippleFocus } from "@typhonjs-fvtt/svelte-standard/action";
	import { TJSIconButton, TJSInput, TJSSelect, TJSToggleIconButton } from "@typhonjs-fvtt/svelte-standard/component";

	const spreadsheetStore = getContext("spreadsheetStore");
	const { details, filterSearch, version } = spreadsheetStore.stores;

	const select = {
		store: version,
		efx: rippleFocus(),
		options: spreadsheetStore.versions.map(entry => ({ label: `v${entry}`, value: entry })),
		styles: {
			width: "7em",
		},
	};

	const input = {
		store: filterSearch,
		efx: rippleFocus(),
		placeholder: "Search module compatibility...",
		type: "search",
	};

	const buttonDetails = {
		store: details,
		icon: "fas fa-info",
		efx: ripple(),
		title: "mcc.showDetails",
		titleSelected: "mcc.hideDetails",
        styles: {
            filter: "drop-shadow(0 0 1px var(--mcc-dark-color))",
		},
	};

	const buttonScrollTop = {
		icon: "fas fa-angle-double-up",
		efx: ripple(),
		title: "mcc.scrollTop",
		styles: {
			position: "fixed",
			bottom: "3rem",
			right: "1.5rem",
			filter: "drop-shadow(0 0 1px var(--mcc-dark-color))",
		},
	};

	/**
	 * Dispatch a CustomEvent that is received by the main Table component to smoothly scroll to the top
	 * @param {MouseEvent} event
	 */
	function scrollSmooth(event) {
		event.target.dispatchEvent(new CustomEvent("scrollTop:smooth", { bubbles: true }));
	}
</script>

<div>
	<!-- TODO: link elements with id -->
	<label>{localize("mcc.selectVersion")}</label>
	<TJSSelect {select} on:change={() => spreadsheetStore.update()} />

	<TJSInput {input} />

	<TJSToggleIconButton button={buttonDetails} />

	<TJSIconButton button={buttonScrollTop} on:click={scrollSmooth} />
</div>

<style>
	label {
		white-space: nowrap;
	}

	div {
		display: flex;
		gap: 1ch;
		padding: 1ch;
		align-items: center;
		color: var(--mcc-text-dark-color);
		text-shadow: none;
	}
</style>
