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
	 * Set the color of a row based for an alternating colors effect
	 * @param element - The element to set the color on
	 * @param status - The status of the row
	 * @param i - The index of the row
	 * @param hover - Whether the row is hovered
	 */
	function setColor(element, status, i, hover = false) {
		const { hsl } = statusData[status];
		element.style.backgroundColor =
			i % 2
				? `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] + 10 * hover}%, ${30 * (hover + 2)}%)`
				: `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] + 5 * hover}%, ${50 * (hover + 3)}%)`;
	}

	/**
	 * Set alternating colors for all of the rows based on their status
	 */
	function setAllColors() {
		document.querySelectorAll("tr").forEach((tr, i) => {
			if (tr.dataset.status) setColor(tr, tr.dataset.status, i + 1);
		});
	}

	// Set all colors when the component is mounted
	onMount(setAllColors);

	// Set all colors after the DOM updates
	afterUpdate(setAllColors);
</script>

<tbody>
	{#each [...$spreadsheetStore] as row, i (row.id)}
		<tr
			animate:flip={{ duration: 250 }}
			on:contextmenu={event => onContextMenu(event, row.id, row.official)}
			on:mouseenter={e => setColor(e.target, row.status, i, true)}
			on:mouseleave={e => setColor(e.target, row.status, i)}
			data-status={row.status}
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
		overflow: scroll;

		tr {
			transition: background-color 250ms;

			&:hover {
				box-shadow: inset 0 8px 6px -6px rgba(0, 0, 0, 0.5), inset 0 -8px 6px -6px rgba(0, 0, 0, 0.5);
				box-sizing: border-box;
			}
		}

		td {
			padding: 1ch;
			border-right: solid 2px rgba(0, 0, 0, 0.2);
		}

		td:last-child {
			border-right: none;
		}
	}

	.center {
		text-align: center;
	}
</style>
