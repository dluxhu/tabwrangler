# Tab Wrangler (dluxhu fork)

This is a fork of [Tab Wrangler](https://github.com/tabwrangler/tabwrangler). It adds a few
patches on top of the newest upstream stable release. Upstream's own documentation is in
[README.md](../README.md).

Fork releases are tagged `v<upstream version>-dlux.<N>`, for example `v9.2.0-dlux.1`.

## Patches

| Patch                       | What it does                                                                                                                                                         | Fork PR                                            |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Last tab of a window        | A setting for what happens when Tab Wrangler closes the last tab of a window: close the window (default), or keep the tab, go to a URL or a blank page, and lock it. | [#3](https://github.com/dluxhu/tabwrangler/pull/3) |
| "In an app window" Tab Rule | A Tab Rules condition that matches tabs in installed web app windows.                                                                                                | [#4](https://github.com/dluxhu/tabwrangler/pull/4) |

The patch list for maintainers is [docs/fork/PATCHES.md](../docs/fork/PATCHES.md).
