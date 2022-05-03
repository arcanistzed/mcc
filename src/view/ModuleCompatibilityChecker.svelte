<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
	import SpreadsheetController from "../controller/SpreadsheetController.js";
	let rows = [];
	(async () => (rows = await SpreadsheetController.getRows()))();

	export let elementRoot;
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
	<main>
		<table>
			<thead><tr><th colspan="7">Module Compatibility</th></tr></thead>
			<tbody>
				{#each rows as row}
					<tr>
						<td>{row[0] ?? ""}</td>
						<td>{row[1] ?? ""}</td>
						<td>{row[2] ?? ""}</td>
						<td>{row[3] ?? ""}</td>
						<td>{row[4] ?? ""}</td>
						<td>{row[5] ?? ""}</td>
						<td>{row[6] ?? ""}</td>
						<td>{row[7] ?? ""}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</main>
</ApplicationShell>

<style lang="scss">
</style>
