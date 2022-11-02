/* global MCC SHEETS_API_KEY FVTT_API_KEY FVTT_LICENSE */

const VERSIONS = ["8", "9", "10"];
const RANGE = encodeURIComponent("A:N");
const TTL = 60 * 10; // 10 minutes

/**
 * Get the Spreadsheet ID for the given version
 * @param {string} version The Foundry VTT core version
 * @returns {string} The corresponding Google Spreadsheet ID
 */
function getSpreadsheetID(version) {
	switch (version) {
		case "8":
			return "17ov1y91lglUXDj8Nu6J22ewC2x_483AoI6RyB6i1NRs";
		case "9":
			return "1ppPR348igxL75M_G7dWl3otzXYpPwrnj7NVSDP8GmVw";
		case "10":
			return "14PHGJzvjhX19rzSHD7VNXtq9UZne4pUxnBn4bxvoM9k";
	}
}

addEventListener(
	"fetch",
	/** @param {FetchEvent} event */
	event => {
		event.respondWith(handleRequest(event.request));
	}
);

/**
 * Handle the request
 * @param {Request} request The request object
 */
async function handleRequest(request) {
	const url = new URL(request.url);

	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Cache-Control", `max-age=${TTL}`);
	headers.append("Expires", new Date(Date.now() + TTL * 1000).toUTCString());
	headers.append("Access-Control-Allow-Origin", "*");
	headers.append("Access-Control-Allow-Headers", "*");
	headers.append("Access-Control-Expose-Headers", "X-Spreadsheet-ID");
	headers.append("Access-Control-Allow-Methods", "GET");

	if (url.pathname === "/api/versions") {
		return new Response(JSON.stringify(VERSIONS), { status: 200, headers });
	}
	if (url.pathname !== "/") {
		return new Response("Not found", { status: 404 });
	}

	const version = url.searchParams.get("version")?.split(".")[0];
	if (!version) {
		return new Response("Missing Foundry VTT core version parameter", { status: 400 });
	}

	const ID = getSpreadsheetID(version);
	if (!ID) {
		return new Response("Unsupported Foundry VTT core version", { status: 422 });
	}

	headers.append("X-Spreadsheet-ID", ID);

	// Return the cached version if it exists
	const cached = await MCC.get(ID, { cacheTtl: TTL });
	if (cached) {
		return new Response(cached, { status: 200, headers });
	}

	// Get the data from Google Sheets
	const response = await fetch(
		`https://sheets.googleapis.com/v4/spreadsheets/${ID}/values/${RANGE}?majorDimension=ROWS&key=${SHEETS_API_KEY}`
	);
	/** @type {string[][]} */
	const { values } = await response.json();

	const data = {
		// Supplement the data
		data: await supplement(values, version),
		// Get the status from the spreadsheet
		status: values[0][0],
	};

	// Cache the data
	await MCC.put(ID, JSON.stringify(data), { expirationTtl: TTL });

	// Return the data
	return new Response(JSON.stringify(data), { status: 201, headers });
}

/**
 * Supplement the data to be in a more useful format
 * @param {string[][]} values The raw data from Google Sheets
 * @param {string} version The Foundry VTT core version
 * @returns {Promise<{title: string, type: string, id: author, version: string, status: string, notes: string}[]>} The data as an array of objects
 */
async function supplement(values, version) {
	// Fetch compatible version from the Foundry VTT API
	const remotePackages = await fromPackageListing(version);

	const data = [];
	// Translate each row into an object
	for (let value of values) {
		value = value.map(v => (v === "#N/A" ? undefined : v));
		const [title, type, id, author, version, status, notes] = value;
		const remote = remotePackages.find(p => p.id === id);
		data.push({
			title,
			type,
			id,
			author,
			version: remote?.version || version, // Use the remote version if it exists
			status,
			notes,
			official: remote ? true : false,
		});
	}
	return data;
}

/**
 * Fetch the compatible version of all packages from the Foundry VTT API
 * @param {string} version The Foundry VTT core version
 * @returns {Promise<{id: string, version: string}[]>} The compatible versions of all packages
 */
async function fromPackageListing(version) {
	const packages = [];
	for (const type of ["module", "system"]) {
		const response = await fetch(
			"https://foundryvtt.com/_api/packages/get",
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `APIKey:${FVTT_API_KEY}`,
				},
				method: "POST",
				body: JSON.stringify({
					type,
					version,
					license: {
						license: FVTT_LICENSE,
					},
				}),
			}
		);
		const json = await response.json();
		if (json.status !== "success") {
			console.error(json);
			return;
		}
		packages.push(
			...json.packages.map(({ name, version }) => ({
				id: name,
				version: version.compatible_core_version,
			}))
		);
	}
	return packages;
}
