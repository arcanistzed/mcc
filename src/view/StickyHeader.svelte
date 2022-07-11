<script>
	import { getContext } from "svelte";

	import {
		ripple,
		rippleFocus } from "@typhonjs-fvtt/svelte-standard/action";

	import {
		TJSIconButton,
		TJSInput,
	 	TJSSelect,
		TJSToggleIconButton } from "@typhonjs-fvtt/svelte-standard/component";

	import { localize } from "../utils.js";

	const spreadsheetStore = getContext("spreadsheetStore");
	const filterSearch = spreadsheetStore.filterSearch;
	const { details, version } = spreadsheetStore.stores;

	const select = {
		store: version,
		efx: rippleFocus(),
		options: spreadsheetStore.versions.map((entry) => ({ label: `v${entry}`, value: entry })),
		styles: {
			width: "7em"
		}
	};

	const input = {
		store: filterSearch,
		efx: rippleFocus(),
		placeholder: "Search module compatibility...",
		type: "search",
		styles: {
			"flex-grow": "1",
			"margin-left": "2em",
			"margin-right": "2em"
		}
	}

	const buttonDetails = {
		store: details,
		icon: "fas fa-info",
		efx: ripple(),
		title: "mcc.detailsShow",
		titleSelected: "mcc.detailsHide",
		styles: { "margin-left": "auto" }
	};

	const buttonScrolltop = {
		icon: "fas fa-angle-double-up",
		efx: ripple(),
		title: "mcc.scrollToTop",
		styles: { "margin-left": "0.5em" }
	};

	/**
	 * @param {MouseEvent}	event -
	 */
	function scrollSmooth(event) {
		event.stopImmediatePropagation();
		event.target.dispatchEvent(new CustomEvent("scrolltop:smooth", { bubbles: true }));
	}
</script>

<tr>
	<td colspan={$details ? 6 : 2}>
		<div>
			<span>{localize("selectVersion")}</span>

			<!-- TODO: Consider showing an overlay on change to show loading state and any error. -->
			<TJSSelect {select} on:change={() => spreadsheetStore.update()} />

			<TJSInput {input} />

			<TJSToggleIconButton button={buttonDetails} />

			<TJSIconButton button={buttonScrolltop} on:click={scrollSmooth}/>
		</div>
	</td>
</tr>

<style>
	div {
		display: flex;
		justify-content: center;
		border-radius: 0.5em;
		border: solid 0.1em rgba(0, 0, 0, 0.5);
		padding: 0.35em 0.25em 0.25em 0.25em;
		margin: 0 0.25em;
		color: var(--color-text-dark-primary);
		text-shadow: none;

		--tjs-comp-input-padding: 0 0.25em;
		--tjs-icon-button-background: rgba(0, 0, 0, 0.1);
		--tjs-icon-button-background-hover: rgba(0, 0, 0, 0.15);
		--tjs-icon-button-background-selected: rgba(0, 0, 0, 0.2);
	}

	span {
		line-height: 2em;
		width: 19em;
	}

	tr {
		height: 3em;
	}
</style>