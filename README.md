# Nook

Headless React hooks for native popovers and tooltips, plus optional styled components. See [the website](website/) for usage.

Early implementation. All packages are private and their names are provisional.

| Package             | Contents                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `packages/core`     | Framework-agnostic DOM helpers and a popover store. No dependencies, never imports a binding.         |
| `packages/react`    | `usePopover()` and `useTooltip()` for React 19.2+, shipped compiled by React Compiler.                |
| `packages/ui`       | Nook's design language in vanilla-extract (`src/*.css.ts`), built to plain CSS and typed class names. |
| `packages/ui-react` | Opinionated components on the hooks and `nook.css`: `Button`, `Tooltip`, `TooltipGroup`, `Popover`.   |
| `website`           | VitePress documentation with live React demos.                                                        |

## Develop

Node.js and pnpm (`mise.toml` provides both):

```sh
pnpm install
pnpm dev       # documentation site
pnpm format    # Prettier
pnpm check     # Prettier check, ESLint, typecheck, React Compiler check
pnpm test      # build, then Playwright suites for the hooks and the website
pnpm bench     # performance comparison, several minutes
pnpm clean     # remove build output and test artifacts
```

Formatting and lint rules are in `.prettierrc.json` and `eslint.config.js`; the compiler check is in `scripts/check-compiler.mjs`.

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
