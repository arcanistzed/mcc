/* global MCC API_KEY */

const VERSIONS = ["9", "10"];
const RANGE = encodeURIComponent("A:N");
const TTL = 60 * 10; // 10 minutes

/**
 * Get the Spreadsheet ID for the given version
 * @param {string} version The Foundry VTT core version
 * @returns {string} The corresponding Google Spreadsheet ID
 */
function getSpreadsheetID(version) {
	switch (version) {
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

	if (url.pathname === "/api/versions") { return new Response(JSON.stringify(VERSIONS), { status: 200, headers }); }
	if (url.pathname !== "/") { return new Response("Not found", { status: 404 }); }

	const version = url.searchParams.get("version")?.split(".")[0];
	if (!version) { return new Response("Missing Foundry VTT core version parameter", { status: 400 }); }

	const ID = getSpreadsheetID(version);
	if (!ID) { return new Response("Unsupported Foundry VTT core version", { status: 422 }); }

	headers.append("X-Spreadsheet-ID", ID);

	// Return the cached version if it exists
	const cached = await MCC.get(ID, { cacheTtl: TTL });
	if (cached) {
		return new Response(cached, { status: 200, headers });
	}

	// Get the data from Google Sheets
	const response = await fetch(
		`https://sheets.googleapis.com/v4/spreadsheets/${ID}/values/${RANGE}?majorDimension=ROWS&key=${API_KEY}`
	);
	/** @type {string[][]} */
	const { values } = await response.json();

	// Cache the data
	await MCC.put(ID, JSON.stringify(values, null, 2), { expirationTtl: TTL });

	// Return the data
	return new Response(JSON.stringify(values, null, 2), { status: 201, headers });
}
