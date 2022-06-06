# Module Compatibility Checker

![Version](https://img.shields.io/github/v/tag/arcanistzed/mcc?label=Version&style=flat-square&color=2577a1) ![Latest Release Download Count](https://img.shields.io/github/downloads/arcanistzed/mcc/latest/module.zip?label=Downloads&style=flat-square&color=9b43a8) ![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://raw.githubusercontent.com/arcanistzed/mcc/main/module.json&style=flat-square&color=ff6400) [![Discord Server](https://img.shields.io/badge/-Discord-%232c2f33?style=flat-square&logo=discord)](https://discord.gg/AAkZWWqVav) [![Patreon](https://img.shields.io/badge/-Patreon-%23141518?style=flat-square&logo=patreon)](https://www.patreon.com/bePatron?u=15896855)

Check your module list for compatibility with the latest major version of Foundry VTT.

![screenshot](https://i.imgur.com/hgcUEgK.png)

https://user-images.githubusercontent.com/82790112/172085158-ab8025cb-edd5-45fd-99c9-92ca8b99d9ae.mp4

## Installation

In the setup screen, use the URL `https://github.com/arcanistzed/mcc/releases/latest/download/module.json` to install the module.

## Development

Once you've cloned the GitHub repo, use `npm install` to fetch all dependencies such as Svelte and TyphonJS Runtime Library. Compile the module with `npm run build` (or `npm run build-watch` for watch mode). Use `npm run release` to compile for production (this is automatically run by the GitHub Actions CI pipeline as well).
In order for your development version of the module to show up in Foundry VTT, you must [symlink](https://world-smiths.github.io/documentation/wiki/symlinking.html) it.

## Support

Please consider supporting me on [my Patreon](https://patreon.com/arcanistzed) if you like my work. You can see a list of all my projects on [my website](https://arcanist.me).

## Bugs

You can submit bugs via [Github Issues](https://github.com/arcanistzed/mcc/issues/new/choose) or on [my Discord server](https://discord.gg/AAkZWWqVav).

## Contact me

Come hang out on my [my Discord server](https://discord.gg/AAkZWWqVav) or [click here to send me an email](mailto:arcanistzed@gmail.com?subject=Module%20Compatibility%20Checker%20module%20for%20Foundry%20VTT).

## License

Copyright © 2021 arcanist

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).
