<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
	import SpreadsheetController from "../controller/SpreadsheetController.js";
	import Loading from "./Loading.svelte";
	import Error from "./Error.svelte";
	import Table from './Table.svelte';

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
		});

	export let elementRoot;
</script>

<ApplicationShell bind:elementRoot styleContent={{ padding: 0 }}>
	{#if state === "loading"}
		<Loading />
	{:else if state === "error"}
		<Error {errorMessage} />
	{:else}
		<Table bind:rows bind:state />
	{/if}
</ApplicationShell>
