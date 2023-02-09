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
			target: ["es2022"]
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
			fs: { strict: false }
		},

		build: {
			outDir: __dirname,
			emptyOutDir: false,
			sourcemap: SOURCEMAPS,
			brotliSize: true,
			minify: COMPRESS ? "terser" : false,
			target: ["es2022"],
			terserOptions: COMPRESS ? { ...terserConfig(), ecma: 2022 } : void 0,
			lib: {
				entry: "./index.js",
				formats: ["es"],
				fileName: "index",
			},
		},

		plugins: [
			svelte({
				compilerOptions: {
					// Provides a custom hash adding the string defined in `s_SVELTE_HASH_ID` to scoped Svelte styles;
					// This is reasonable to do as the framework styles in TRL compiled across `n` different packages
					// will be the same. Slightly modifying the hash ensures that your package has uniquely scoped
					// styles for all TRL components and makes it easier to review styles in the browser debugger.
					cssHash: ({ hash, css }) => `svelte-${MODULE_ID}-${hash(css)}`
				},
				preprocess: preprocess()
			}),

			// Necessary when bundling npm-linked packages
			resolve({
				browser: true,
				dedupe: ["svelte", '@typhonjs-fvtt/runtime', '@typhonjs-fvtt/svelte-standard'],
			}),
		],
	};
});
