<svelte:options accessors={true} />

<script>
	import { getContext, setContext } from "svelte";

	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
	import { debounce } from "@typhonjs-fvtt/runtime/svelte/util";

	import { SpreadsheetStore } from "../store/spreadsheetStore.js";
	import { mccSessionStorage } from "../store/mccSessionStorage.js";

	import Loading from "./init/Loading.svelte";
	import Error from "./init/Error.svelte";
	import Table from "./table/Table.svelte";

	const spreadsheetStore = new SpreadsheetStore();
	setContext("spreadsheetStore", spreadsheetStore);

	export let elementRoot;

	const { application } = getContext("external");

	// Get a store that is synchronized with session storage
	const stateStore = mccSessionStorage.getStore(`mcc.appState`);

	// Application position store reference. Stores need to be a top level variable to be accessible for reactivity.
	const position = application.position;

	// A debounced callback that serializes application state after 500-millisecond delay.
	const storePosition = debounce(() => ($stateStore = application.state.get()), 500);

	// Reactive statement to invoke debounce callback on Position changes.
	$: storePosition($position);

	// Reload when the version is changed
	const { version } = spreadsheetStore.stores;
</script>

<ApplicationShell bind:elementRoot>
	{#key $version}
		{#await spreadsheetStore.initialize()}
			<Loading />
		{:then}
			<Table />
		{:catch error}
			<Error {error} />
		{/await}
	{/key}
</ApplicationShell>
