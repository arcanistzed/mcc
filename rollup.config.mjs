/* global process */
import resolve from "@rollup/plugin-node-resolve"; // This resolves NPM modules from node_modules.
import { postcssConfig, terserConfig } from "@typhonjs-fvtt/runtime/rollup";
import postcss from "rollup-plugin-postcss"; // Process Sass / CSS w/ PostCSS
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser"; // Terser is used for minification / mangling
import preprocess from "svelte-preprocess";

const PRODUCTION = process.env.BUILD === "production";

const COMPRESS = PRODUCTION; // Compress the module bundle in production mode
const SOURCEMAPS = PRODUCTION; // Generate sourcemaps for the bundle

// Creates a standard configuration for PostCSS
const postcssMain = postcssConfig({
	extract: "mcc.css",
	compress: COMPRESS,
	sourceMap: SOURCEMAPS,
});

const RESOLVE_CONFIG = {
	browser: true,
	dedupe: ["svelte"],
};

export default () => {
	// Defines potential output plugins to use conditionally
	const outputPlugins = COMPRESS ? [terser(terserConfig())] : [];

	// Defines whether source maps are generated
	const sourcemap = SOURCEMAPS;

	return [
		{
			// The main module bundle
			input: "src/init.js",
			output: {
				file: "dist/mcc.js",
				format: "es",
				plugins: outputPlugins,
				sourcemap,
			},
			plugins: [
				svelte({
					preprocess: preprocess(),
					onwarn: (warning, handler) => {
						// Suppress `a11y-missing-attribute` for missing href in <a> links.
						// Foundry doesn't follow accessibility rules.
						if (warning.message.includes("<a> element should have an href attribute")) {
							return;
						}

						// Let Rollup handle all other warnings normally
						handler(warning);
					},
				}),

				postcss(postcssMain),

				resolve(RESOLVE_CONFIG),
			],
			onwarn(warning, warn) {
				// Suppress warning from library code
				if (
					warning.code === "THIS_IS_UNDEFINED" &&
					warning.loc.file.includes("node_modules/@google-web-components/google-chart/google-chart.js")
				) {
					return;
				}

				// Use default for everything else
				warn(warning);
			},
		},
	];
};
