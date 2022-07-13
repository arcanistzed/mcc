<svelte:options accessors={true} />

<script>
	import { setContext } from "svelte";

	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";

	import { spreadsheetStore } from "../store/SpreadsheetStore.js";

	import Loading from "./Loading.svelte";
	import Error from "./Error.svelte";
	import Table from "./Table.svelte";

	setContext("spreadsheetStore", spreadsheetStore);

	export let elementRoot;
</script>

<ApplicationShell bind:elementRoot>
	{#await spreadsheetStore.initialize()}
		<Loading />
	{:then result}
		<Table />
	{:catch error}
		<Error {error} />
	{/await}
</ApplicationShell>
