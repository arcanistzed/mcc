import ModuleCompatibilityChecker from "./view/ModuleCompatibilityChecker.js";

Hooks.once("ready", () => new ModuleCompatibilityChecker().render(true, { focus: true }));
globalThis.ModuleCompatibilityChecker = ModuleCompatibilityChecker;
