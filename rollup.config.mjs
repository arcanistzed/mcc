import { babel } from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss"; // Process Sass / CSS w/ PostCSS
import resolve from "@rollup/plugin-node-resolve"; // This resolves NPM modules from node_modules.
import svelte from "rollup-plugin-svelte";
import preprocess from "svelte-preprocess";
import { terser } from "rollup-plugin-terser"; // Terser is used for minification / mangling
import { postcssConfig, terserConfig, typhonjsRuntime } from "@typhonjs-fvtt/runtime/rollup";

const COMPRESS = false; // Set to true to compress the module bundle.
const SOURCEMAPS = true; // Generate sourcemaps for the bundle (recommended).

// Set to true to enable linking against the TyphonJS Runtime Library module.
// You must add a Foundry module dependency on the `typhonjs` Foundry package or manually install it in Foundry from:
// https://github.com/typhonjs-fvtt-lib/typhonjs/releases/latest/download/module.json
const TYPHONJS_MODULE_LIB = false;

// Creates a standard configuration for PostCSS with autoprefixer & postcss-preset-env.
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
	// Defines potential output plugins to use conditionally if the .env file indicates the bundles should be
	// minified / mangled.
	const outputPlugins = COMPRESS ? [terser(terserConfig())] : [];

	// Defines whether source maps are generated / loaded.
	const sourcemap = SOURCEMAPS;

	return [
		{
			// The main module bundle
			input: `src/init.js`,
			output: {
				file: `dist/mcc.js`,
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
						if (warning.message.includes(`<a> element should have an href attribute`)) {
							return;
						}

						console.log(warning);

						// Let Rollup handle all other warnings normally.
						handler(warning);
					},
				}),

				postcss(postcssMain),

				resolve(RESOLVE_CONFIG),

				// When s_TYPHONJS_MODULE_LIB is true transpile against the Foundry module version of TRL.
				TYPHONJS_MODULE_LIB && typhonjsRuntime(),

				/* babel({
					babelHelpers: "bundled",
					presets: [
						["@babel/preset-env", { bugfixes: true, shippedProposals: true, targets: { esmodules: true } }],
					],
				}), */
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
