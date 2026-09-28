# Nook

Accessible, headless primitives built on native HTML. The browser does the behavior (`popovertarget`, `interestfor`, the top layer, CSS anchor positioning); Nook adds only what the platform leaves out. User documentation is the website in `website/`.

Early implementation. All packages are private and their names are provisional.

| Package          | Contents                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `packages/core`  | Framework-agnostic DOM helpers and a popover store. No dependencies, never imports a binding. |
| `packages/react` | `usePopover()` and `useTooltip()` for React 19.2+, shipped compiled by React Compiler.        |
| `website`        | VitePress documentation with live React demos.                                                |

## Develop

Node.js and pnpm (`mise.toml` provides both):

```sh
pnpm install
pnpm dev       # documentation site
pnpm format    # Prettier
pnpm check     # Prettier check, ESLint, typecheck, React Compiler check
pnpm test      # build, then Playwright suites for the hooks and the website
pnpm clean     # remove build output and test artifacts
```

Rules are enforced by tools rather than prose. Formatting is `.prettierrc.json`. Code rules are `eslint.config.js`: the Rules of React, no manual memoization, core never importing a framework, and no test IDs in demos. `packages/react/scripts/check-compiler.mjs` fails if an exported hook is not compiled.

## Design decisions

- **Hooks return attributes.** Props contain no event handlers and no trigger refs, so several hooks compose on one element without Slot, `cloneElement`, or prop merging.
- **The browser owns the state.** Hooks read `:popover-open` through core's store with `useSyncExternalStore` and hold no React state. A controlled `open` drives the browser, but the browser can still close an `auto` popover, because `beforetoggle` cannot cancel closing.
- **Relationships render on the server,** so open, close, and Escape work before hydration.
- **Tooltips use `interestfor`** (Chromium-only, accepted), plus an explicit ARIA relationship, because the native one exists only while the tooltip is open.
- **React Compiler:** `target: '19'`, `panicThreshold: 'none'` for the published build. Tests run against compiled and uncompiled code; correctness never depends on memoization. Lint and compiler reports can be false positives: fix real violations, and record justified exceptions inline with a reason.
- **Next:** menu (keyboard model; `focusgroup` was not available in Chromium 145), hover card, toast (`ariaNotify`), select, combobox.

## Browser-support policy

Build on native capabilities first. Support in only a few browsers, including Chromium-only, experimental, or flag-gated features, is acceptable. Add no polyfills or fallbacks. Record each feature's capabilities, versions, and gaps in [docs/research.md](docs/research.md), and verify the behavior the design depends on with a test. Limited support never excuses broken accessibility for what is implemented.

## License

[MIT](LICENSE), copyright Nook contributors.
