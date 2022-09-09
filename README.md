# Module Compatibility Checker

![Version](https://img.shields.io/github/v/tag/arcanistzed/mcc?label=Version&style=flat-square&color=2577a1) ![Latest Release Download Count](https://img.shields.io/github/downloads/arcanistzed/mcc/latest/module.zip?label=Downloads&style=flat-square&color=9b43a8) ![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://raw.githubusercontent.com/arcanistzed/mcc/main/module.json&style=flat-square&color=ff6400) [![Translation status](https://weblate.foundryvtt-hub.com/widgets/mcc/-/svg-badge.svg)](https://weblate.foundryvtt-hub.com/engage/mcc/) [![Discord Server](https://img.shields.io/badge/-Discord-%232c2f33?style=flat-square&logo=discord)](https://discord.gg/AAkZWWqVav) [![Patreon](https://img.shields.io/badge/-Patreon-%23141518?style=flat-square&logo=patreon)](https://www.patreon.com/bePatron?u=15896855)

Check your module list for compatibility with the latest major version of Foundry VTT.

[View the video on YouTube!](https://www.youtube.com/watch?v=1UPVY52k6Tg)

[![screenshot](https://i.imgur.com/lIkl2md.png)](https://www.youtube.com/watch?v=1UPVY52k6Tg)

## Installation

In the setup screen, use the URL `https://github.com/arcanistzed/mcc/releases/latest/download/module.json` to install the module.

## Development

Once you've cloned the GitHub repo, use `npm install` to fetch all dependencies such as Svelte and TyphonJS Runtime Library. Compile the module for production with `npm run build` and then use `npm run dev` while you develop to get Vite hot module reloading.
In order for your development version of the module to show up in Foundry VTT, you must [symlink](https://world-smiths.github.io/documentation/wiki/symlinking.html) the module to your `Data/modules` directory.
Run `wrangler dev worker/worker.js` to test out the Cloudflare Worker or `wrangler publish worker/worker.js` to publish it to your Cloudflare account.

## Support

Please consider supporting me on [my Patreon](https://patreon.com/arcanistzed) if you like my work. You can see a list of all my projects on [my website](https://arcanist.me).

## Bugs

You can submit bugs via [Github Issues](https://github.com/arcanistzed/mcc/issues/new/choose) or on [my Discord server](https://discord.gg/AAkZWWqVav).

## Contact me

Come hang out on my [my Discord server](https://discord.gg/AAkZWWqVav) or [click here to send me an email](mailto:arcanistzed@gmail.com?subject=Module%20Compatibility%20Checker%20module%20for%20Foundry%20VTT).

## License

Copyright © 2021 arcanist

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).
