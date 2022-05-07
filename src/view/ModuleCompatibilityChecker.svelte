<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
	import { fade } from "svelte/transition";

	import GooglePieChart from "./components/GooglePieChart.svelte";
	import PieChart from "./components/PieChart.svelte";
	import Loading from "./components/Loading.svelte";
	import Error from "./components/Error.svelte";

	import SpreadsheetController from "../controller/SpreadsheetController.js";
	import { isV10, localize } from "../utils.js";

	let rows = [],
		details = false,
		working,
		known,
		percentage,
		direction = false;

	const spreadsheetURL = `https://docs.google.com/spreadsheets/d/${SpreadsheetController.spreadsheetID}/edit`;

	async function getRows() {
		rows = await SpreadsheetController.getRows();
		return rows;
	}

	const colors = {
			X: "#cc0000",
			O: "#f1c232",
			B: "#b45f06",
			G: "#6aa84f",
			N: "#3d85c6",
			A: "#666666",
			U: "#ffffff",
		},
		explanations = {
			X: localize("statuses.x"),
			O: localize("statuses.o"),
			B: localize("statuses.b"),
			G: localize("statuses.g"),
			N: localize("statuses.n"),
			A: localize("statuses.a"),
			U: localize("statuses.u"),
		};

	$: {
		working = rows.filter(row => row.status === "G" || row.status === "N").length;
		known = rows.filter(row => row.status !== "U").length;
		percentage = parseFloat((100 * (working / Math.max(known, 1))).toFixed(2));
	}

	function sortBy(heading) {
		rows = rows.sort((a, b) => a[heading].localeCompare(b[heading]));
		if (direction) rows = rows.reverse();
	}

	export let elementRoot;
</script>

<ApplicationShell bind:elementRoot styleContent={{ padding: 0 }}>
	{#await getRows()}
		<Loading />
	{:then rows}
		<main>
			<header>
				<PieChart {percentage} />
				<GooglePieChart
					cols={[
						{ type: "string" },
						{ type: "number" },
					]}
					rows={[
						[localize("ready"), percentage],
						[localize("notReady"), 100 - percentage]
					]}
					on:select={(...args) => console.log(args)}
				/>
				<button on:click={() => (details = !details)}>
					{details ? localize("hide") : localize("show")}
					{localize("details")}
				</button>
			</header>
			<table>
				<thead>
					<tr>
						<th on:click={() => sortBy("title")}>{localize("title")}</th>
						{#if details}
							<th transition:fade>{localize("type")}</th>
							<th transition:fade>{localize("id")}</th>
							<th transition:fade>{localize("author")}</th>
							<th transition:fade>{localize("version")}</th>
						{/if}
						<th>{localize("status")}</th>
						<th>{localize("notes")}</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row, i}
						<tr style="background-color: {colors[row.status] + (i % 2 === 0 ? '50' : '80')}">
							<td>{row.title}</td>
							{#if details}
								<td transition:fade>{row.type}</td>
								<td transition:fade>{row.id}</td>
								<td transition:fade>{row.author}</td>
								<td transition:fade>{row.version}</td>
							{/if}
							{#if isV10}
								<td data-tooltip={explanations[row.status]}>{row.status}</td>
							{:else}
								<td title={explanations[row.status]}>{row.status}</td>
							{/if}
							<td>{row.notes}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td colspan={details ? 4 : 1}>{localize("report.count")}: {rows.length}</td>
						<td colspan={details ? 2 : 1}>{localize("report.percentage")}: {percentage}%</td>
						<td>
							<a href={spreadsheetURL}>
								{localize("source")}
								<i class="fa-solid fa-arrow-up-right-from-square" />
							</a>
						</td>
					</tr>
				</tfoot>
			</table>
		</main>
	{:catch error}
		<Error {error} />
	{/await}
</ApplicationShell>

<style lang="scss" scoped>
	main {
		display: flex;
		gap: 1em;
		flex-direction: column;
		overflow-y: scroll;
		position: relative;
		margin: 1em;
		padding: 0 0.5em;
	}

	header {
		display: flex;
		justify-content: space-between;
		position: relative;
	}

	button {
		position: absolute;
		width: fit-content;
		right: 0;
		bottom: 0;
	}

	table {
		height: fit-content;
		width: 100%;
		margin: 0;
	}

	thead,
	tfoot {
		position: sticky;
		background-color: #555;
	}

	thead {
		top: 0;
	}

	th {
		white-space: nowrap;
	}

	td,
	th {
		padding: 0.5em;
	}

	tbody {
		overflow: scroll;
	}

	tr {
		transition: 250ms;
	}

	tr:hover {
		filter: drop-shadow(0 0 0 black);
	}

	tfoot {
		bottom: 0;
		color: white;
		text-align: center;
	}

	tfoot a {
		color: white;
		white-space: nowrap;
	}
</style>
