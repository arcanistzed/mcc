import ModuleCompatibilityChecker from "./view/app.js";

Hooks.once("ready", () => new ModuleCompatibilityChecker().render(true, { focus: true }));
globalThis.ModuleCompatibilityChecker = ModuleCompatibilityChecker;