<svelte:options accessors={true} />

<script>
	import { setContext } from "svelte";

	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";

	import { spreadsheetStore } from "../store/SpreadsheetStore.js";

	import Loading from "./Loading.svelte";
	import Error from "./Error.svelte";
	import Table from "./Table.svelte";

	setContext("spreadsheetStore", spreadsheetStore);

	let rows = [];

	export let elementRoot;
</script>

<ApplicationShell bind:elementRoot stylesContent={{ padding: 0 }}>
	{#await spreadsheetStore.populate()}
		<Loading />
	{:then result}
		{(console.log(`!! MCC - then - 1 - spreadsheetStore.version: `, spreadsheetStore.version), '')}
		{(console.log(`!! MCC - then - 2 - spreadsheetStore.versions: `, spreadsheetStore.versions), '')}
		<Table bind:rows />
	{:catch errorMessage}
		<Error {errorMessage} />
		{(console.error(errorMessage), '')}
	{/await}
</ApplicationShell>
