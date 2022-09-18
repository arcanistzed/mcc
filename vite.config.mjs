import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve"; // This resolves NPM modules from node_modules
import preprocess from "svelte-preprocess";
import { postcssConfig, terserConfig } from "@typhonjs-fvtt/runtime/rollup";

const MODULE_ID = "mcc";

export default defineConfig(({ command }) => {
	const PRODUCTION = command === "build";

	const COMPRESS = PRODUCTION; // Compress the module bundle in production mode
	const SOURCEMAPS = PRODUCTION; // Generate sourcemaps for the bundle in production mode

	return {
		root: "src/", // Source location (esbuild root)
		base: `/modules/${MODULE_ID}/`, // Base module path for port 30001 (served dev directory)
		publicDir: false, // No public resources to copy
		cacheDir: "../.vite-cache", // Relative from root directory

		resolve: { conditions: ["import", "browser"] },

		esbuild: {
			target: ["es2022", "chrome100"],
			keepNames: true, // Note: doesn't seem to work
		},

		css: {
			// Creates a standard configuration for PostCSS with autoprefixer & postcss-preset-env
			postcss: postcssConfig({
				compress: COMPRESS,
				sourceMap: SOURCEMAPS,
				extract: "style.css",
			}),
		},

		// About server options:
		// - Set to `open` to boolean `false` to not open a browser window automatically. This is useful if you set up a debugger instance in your IDE and launch it with the URL: 'http://localhost:30001/game'.
		// - The top proxy entry for `languages` will pull the language resources from the main FVTT (port 30000) server. This is necessary to reference the dev resources as the root is `/src` and there is no public / static resources served.
		server: {
			port: 30001,
			open: "/game",
			proxy: {
				[`^(/modules/${MODULE_ID}/languages)`]: "http://localhost:30000",
				[`^(/modules/${MODULE_ID}/style.css)`]: "http://localhost:30000",
				[`^(?!/modules/${MODULE_ID}/)`]: "http://localhost:30000",
				"/socket.io": { target: "ws://localhost:30000", ws: true },
			},
			hmr: {
				overlay: false,
			},
		},

		build: {
			outDir: __dirname,
			emptyOutDir: false,
			sourcemap: SOURCEMAPS,
			brotliSize: true,
			minify: COMPRESS ? "terser" : false,
			target: ["es2022", "chrome100"],
			terserOptions: COMPRESS ? { ...terserConfig(), ecma: 2022 } : void 0,
			lib: {
				entry: "./index.js",
				formats: ["es"],
				fileName: "index",
			},
		},

		plugins: [
			svelte({
				preprocess: preprocess(),
				onwarn: (warning, handler) => {
					// Suppress `a11y-missing-attribute` for missing href in <a> links
					// Suppress `a11y-label-has-associated-control` for detached <label> and control
					if (
						warning.message.includes("<a> element should have an href attribute") ||
						warning.message.includes("A form label must be associated with a control")
					) {
						return;
					}

					// Let Rollup handle all other warnings normally
					handler && handler(warning);
				},
			}),

			// Necessary when bundling npm-linked packages
			resolve({
				browser: true,
				dedupe: ["svelte"],
			}),
		],
	};
});
