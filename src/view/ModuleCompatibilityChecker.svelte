<svelte:options accessors={true} />

<script>
	import { onMount } from "svelte";
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
	import SpreadsheetController from "../controller/SpreadsheetController.js";
	import Loading from "./Loading.svelte";
	import Error from "./Error.svelte";
	import Table from "./Table.svelte";

	let rows = [],
		state = "loading",
		errorMessage;

	SpreadsheetController.getRows()
		.then(result => {
			state = null;
			rows = result;
		})
		.catch(error => {
			state = "error";
			errorMessage = error;
			console.error(error);
		});

	// Fix window header text overflow (https://gitlab.com/foundrynet/foundryvtt/-/issues/7220)
	onMount(() => {
		const title = elementRoot.querySelector(".window-title");
		title.style.textOverflow = "ellipsis";
		title.style.overflow = "hidden";
		title.style.whiteSpace = "nowrap";
	});

	export let elementRoot;
</script>

<ApplicationShell bind:elementRoot stylesContent={{ padding: 0 }}>
	{#if state === "loading"}
		<Loading />
	{:else if state === "error"}
		<Error {errorMessage} />
	{:else}
		<Table bind:rows bind:state />
	{/if}
</ApplicationShell>
