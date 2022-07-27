<script>
	/*
	This component hooks up several stores to input components including the spreadsheet version selection, search filter, showing / hiding package details, showing only active packages, and dispatches a CustomEvent to smoothly scroll the table to top.
	*/
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";
	import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
	import { ripple, rippleFocus } from "@typhonjs-fvtt/svelte-standard/action";
	import { TJSIconButton, TJSInputText, TJSSelect, TJSToggleIconButton } from "@typhonjs-fvtt/svelte-standard/component";

	const spreadsheetStore = getContext("spreadsheetStore");
	const { details, active, filterSearch, scrollTop, version } = spreadsheetStore.stores;

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
	};

	const buttonActive = {
		store: active,
		icon: "fas fa-box-check",
		efx: ripple(),
		title: "mcc.enableActive",
		titleSelected: "mcc.disableActive",
	};

	const buttonScrollTop = {
		icon: "fas fa-angle-double-up",
		efx: ripple(),
		title: "mcc.scrollTop",
	};

	/**
	 * Dispatch a CustomEvent that is received by the main Table component to smoothly scroll to the top
	 * @param {MouseEvent} event
	 */
	function scrollSmooth(event) {
		event.target.dispatchEvent(new CustomEvent("scrollTop:smooth", { bubbles: true }));
	}
</script>

<nav>
	<!-- TODO: link elements with id -->
	<label>{localize("mcc.selectVersion")}</label>
	<TJSSelect {select} />

	<TJSInputText {input} />

	<div class="iconButton">
		<TJSToggleIconButton button={buttonDetails} />
	</div>

	<div class="iconButton">
		<TJSToggleIconButton button={buttonActive} />
	</div>
</nav>

{#if $scrollTop > 300}
	<div transition:fade class="scrollTop iconButton">
		<TJSIconButton button={buttonScrollTop} on:click={scrollSmooth} />
	</div>
{/if}

<style>
	label {
		white-space: nowrap;
	}

	nav {
		display: flex;
		gap: 1ch;
		padding: 1ch;
		align-items: center;
		color: var(--mcc-text-dark-color);
		text-shadow: none;
	}

	.scrollTop {
		position: fixed;
		bottom: 3rem;
		right: 1.5rem;
		z-index: 1;
	}

	.iconButton {
		filter: drop-shadow(0 0 1px var(--mcc-dark-color));
	}
</style>
