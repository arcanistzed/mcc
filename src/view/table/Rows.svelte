<script>
	import { getContext } from "svelte";
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
				items.push({
					label: "mcc.packageListingURL",
					icon: "fas fa-link",
					onclick: () => window.open(`https://foundryvtt.com/packages/${linkData.id}`, "_blank"),
				});
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
</script>

<tbody>
	{#each [...$spreadsheetStore] as row, i (row.id)}
		<tr
			animate:flip={{ duration: 250 }}
			on:contextmenu={event => onContextMenu(event, row.id, row.official)}
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

			&:nth-child(odd) {
				&[data-status="X"] {
					background-color: hsla(0, 100%, 60%, 88%);
					&:hover {
						background-color: hsla(0, 100%, 58%, 92.4%);
					}
				}
				&[data-status="O"] {
					background-color: hsla(45, 90%, 60%, 88%);
					&:hover {
						background-color: hsla(45, 90%, 58%, 92.4%);
					}
				}
				&[data-status="B"] {
					background-color: hsla(30, 90%, 40%, 88%);
					&:hover {
						background-color: hsla(30, 90%, 38%, 92.4%);
					}
				}
				&[data-status="G"] {
					background-color: hsla(120, 40%, 50%, 88%);
					&:hover {
						background-color: hsla(120, 40%, 48%, 92.4%);
					}
				}
				&[data-status="N"] {
					background-color: hsla(200, 60%, 50%, 88%);
					&:hover {
						background-color: hsla(200, 60%, 48%, 92.4%);
					}
				}
				&[data-status="A"] {
					background-color: hsla(0, 0%, 50%, 88%);
					&:hover {
						background-color: hsla(0, 0%, 48%, 92.4%);
					}
				}
				&[data-status="U"] {
					background-color: hsla(0, 0%, 100%, 88%);
					&:hover {
						background-color: hsla(0, 0%, 98%, 92.4%);
					}
				}
			}

			&:nth-child(even) {
				&[data-status="X"] {
					background-color: hsla(0, 100%, 61.4%, 70.4%);
					&:hover {
						background-color: hsla(0, 100%, 64.2%, 66%);
					}
				}
				&[data-status="O"] {
					background-color: hsla(45, 90%, 61.4%, 70.4%);
					&:hover {
						background-color: hsla(45, 90%, 64.2%, 66%);
					}
				}
				&[data-status="B"] {
					background-color: hsla(30, 90%, 41.4%, 70.4%);
					&:hover {
						background-color: hsla(30, 90%, 44.2%, 66%);
					}
				}
				&[data-status="G"] {
					background-color: hsla(120, 40%, 51.4%, 70.4%);
					&:hover {
						background-color: hsla(120, 40%, 54.2%, 66%);
					}
				}
				&[data-status="N"] {
					background-color: hsla(200, 60%, 51.4%, 70.4%);
					&:hover {
						background-color: hsla(200, 60%, 54.2%, 66%);
					}
				}
				&[data-status="A"] {
					background-color: hsla(0, 0%, 51.4%, 70.4%);
					&:hover {
						background-color: hsla(0, 0%, 54.2%, 66%);
					}
				}
				&[data-status="U"] {
					background-color: hsla(0, 0%, 101.4%, 70.4%);
					&:hover {
						background-color: hsla(0, 0%, 104.2%, 66%);
					}
				}
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
