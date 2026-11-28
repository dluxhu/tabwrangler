# Fork patches

Source of truth for the patches in this fork.

- Upstream: <https://github.com/tabwrangler/tabwrangler>
- `main`: fast-forward mirror of upstream `main`. No fork commits.
- `upstream-stable`: the newest upstream stable tag (now `v9.2.0`). Base of every patch branch
  and every fork PR.
- Branch prefix: `dlux/`. Release suffix: `dlux`. A release is tagged
  `v<upstream version>-dlux.<N>`, for example `v9.2.0-dlux.1`. `<N>` starts at 1 for each
  upstream version.
- Check command for every branch: `npm run lint && npm run check-types && npm test && npm run build`.

## Release order

1. `dlux/last-tab-behavior`
2. `dlux/app-window-rule`
3. `dlux/fork-setup`

## dlux/last-tab-behavior

- Base: `upstream-stable`
- Kind: upstream candidate
- What it does: new sync settings `lastTabBehavior` and `lastTabUrl`. When a wrangle removes
  every tab of a window, close the window (default), or keep one tab, go to a URL or
  `about:blank`, and lock it.
- Fork PR: [#3](https://github.com/dluxhu/tabwrangler/pull/3)
- Upstream state: not offered
- Files: `app/_locales/en/messages.json`, `app/js/OptionsTab/LastTabOption.tsx`,
  `app/js/OptionsTab/LastTabOption.test.tsx`, `app/js/OptionsTab/OptionsTab.tsx`,
  `app/js/actions/importExportActions.test.ts`, `app/js/settings.ts`, `app/js/tabUtil.ts`,
  `app/js/tabUtil.test.ts`
- Check: the check command above

## dlux/app-window-rule

- Base: `upstream-stable`
- Kind: upstream candidate
- What it does: Tab Rules condition "In an app window" (`{ type: "appWindow" }`). It matches
  tabs in windows of type `app` (installed web apps). `app/js/appWindows.ts` tracks the open
  app windows.
- Fork PR: [#4](https://github.com/dluxhu/tabwrangler/pull/4)
- Upstream state: not offered
- Files: `app/_locales/en/messages.json`, `app/background.ts`, `app/js/App.tsx`,
  `app/js/LockTab/OpenTabRow.tsx`, `app/js/OptionsTab/TabRules.tsx`,
  `app/js/OptionsTab/TabRules.test.tsx`, `app/js/appWindows.ts`, `app/js/appWindows.test.ts`,
  `app/js/menus.ts`, `app/js/tabRules.ts`, `app/js/tabRules.test.ts`, `app/js/tabUtil.ts`,
  `app/js/tabUtil.test.ts`
- Check: the check command above

## dlux/fork-setup

- Base: `upstream-stable`
- Kind: fork-only
- What it does: the fork docs, `.github/README.md` (fork front page) and this file. Only this
  branch edits them.
- Fork PR: [#5](https://github.com/dluxhu/tabwrangler/pull/5)
- Upstream state: fork-only, never offered
- Files: `.github/README.md`, `docs/fork/PATCHES.md`
- Check: none (docs only)

## Follow a new upstream stable release

1. Fast-forward `main` to upstream `main`.
2. Move `upstream-stable` to the newest stable tag.
3. Merge that tag into each patch branch, in release order. Fix a conflict on the branch that
   owns the conflicting change. Run the check command.
4. Push the branches. The fork PRs update by themselves.

## Cut a release

Only with the owner's go-ahead.

1. Start `release/v<upstream version>-dlux.<N>` at the upstream stable tag.
2. In release order, add one commit per patch branch: its net change against its merge base
   with the tag.
3. Run the check command. Tag `v<upstream version>-dlux.<N>`. Move `release/latest` to it.
4. The owner approves the push of the release branch, the tag and `release/latest`.
