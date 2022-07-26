<script>
	import { getContext, onMount, afterUpdate } from "svelte";
	import { flip } from "svelte/animate";

	import { TJSContextMenu } from "@typhonjs-fvtt/svelte-standard/application";

	import { statusData } from "../../store/statusData.js";

	const spreadsheetStore = getContext("spreadsheetStore");
	const { details } = spreadsheetStore.stores;

	/**
	 * Show a context menu for the table row clicked
	 * @param {MouseEvent} event
	 * @param {string} id - Package ID
	 * @param {boolean} official - Whether the package is on the official listing
	 */
	function onContextMenu(event, id, official) {
		const linkData = spreadsheetStore.getPackageLinks(id);

		if (linkData) {
			const items = [];

			if (official) {
				items.push(
					{
						label: "mcc.packageListingURL",
						icon: "fas fa-external-link",
						onclick: () => window.open(`https://foundryvtt.com/packages/${linkData.id}`, "_blank"),
					},
					{
						label: "mcc.foundryHubURL",
						icon: "fas fa-external-link",
						image: "https://www.foundryvtt-hub.com/wp-content/uploads/2021/08/foundryhublogo4-verysmall.webp",
						onclick: () => window.open(`https://www.foundryvtt-hub.com/package/${linkData.id}`, "_blank"),
					},
					{
						label: "mcc.bazaarURL",
						icon: "fas fa-external-link",
						image: "https://forge-vtt.com/images/the-forge-logo-48x48.png",
						onclick: () => window.open(`https://forge-vtt.com/bazaar/package/${linkData.id}`, "_blank"),
					}
				);
			}

			if (linkData.url) {
				items.push({
					label: "mcc.projectURL",
					icon: "fas fa-code",
					onclick: () => window.open(linkData.url, "_blank"),
				});
			}

			TJSContextMenu.create({
				duration: 200,
				id: "mmc-package-menu",
				x: event.pageX,
				y: event.pageY,
				items,
			});
		}
	}

	/**
	 * Get the color for a given status
	 * @param {string} status - Status
	 * @returns {string} - Color in HSL format
	 */
	function getColor(status) {
		const { hsl } = statusData[status];
		return `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 60%)`;
	}
</script>

<tbody>
	{#each [...$spreadsheetStore] as row (row.id)}
		<tr
			animate:flip={{ duration: 250 }}
			on:contextmenu={(event) => onContextMenu(event, row.id, row.official)}
			style:background-color={getColor(row.status)}
			title={statusData[row.status].explanation}
		>
			<td>{row.title}</td>
			{#if $details}
				<td>{row.type}</td>
				<td>{row.id}</td>
				<td class="center">{row.version}</td>
				<td class="center">{row.status}</td>
			{/if}
			<td>{row.notes}</td>
		</tr>
	{/each}
</tbody>

<style lang="scss">
	tbody {
		tr {
			transition: background-color 250ms;

			&:hover {
				box-shadow: inset 0 10px 10px -10px rgb(0 0 0 / 50%), inset 0 -10px 10px -10px rgb(0 0 0 / 50%);
				backdrop-filter: brightness(1.2) saturate(1.2);
			}
		}

		td {
			padding: 1ch;
			border-right: solid 1px rgba(0, 0, 0, 0.1);
			border-bottom: solid 1px rgba(0, 0, 0, 0.1);
		}

		td:last-child {
			border-right: none;
		}
	}

	.center {
		text-align: center;
	}
</style>
