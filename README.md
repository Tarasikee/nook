# Nook

Native React components distributed as editable source through the [shadcn CLI](https://ui.shadcn.com/docs/registry).

Early implementation. The component workspace is private; consumers copy individual components instead of installing Nook runtime packages.

`packages/ui/src` contains `Button`, `Dialog`, `Popover`, and `Tooltip`, Tailwind v4 utility classes, and local native-browser helpers. Button variants use CVA. `registry.json` selects the files and npm dependencies for each download. Consumers need Tailwind CSS v4.3+; the workspace uses v4.3.5. No component CSS imports or vanilla-extract setup is required.

`packages/cli` owns the `nook` executable, registry builds, and shared development scripts. Components, hooks, and platform tests live together in `packages/ui`; the old `core`, `react`, and `ui-react` directories are removed.

Build the registry with `pnpm build:registry`. In a Tailwind v4 app with a shadcn `components.json`, install one generated item:

```sh
pnpm exec nook add button --cwd /path/to/app
```

Each JSON item includes its component source and required local helpers. The CLI places them in the app's configured UI directory and installs npm dependencies. The CLI bundles the generated items in `packages/cli/dist/r`, which can also be served as a static registry. `nook build` accepts the upstream registry build options, and `nook add` also accepts item URLs and file paths.

## Develop

Node.js and pnpm (`mise.toml` provides both):

```sh
pnpm install
pnpm dev       # documentation site
pnpm format    # Prettier
pnpm check     # Prettier check, ESLint, typecheck, React Compiler check
pnpm test      # registry checks, then Playwright suites for components, hooks, and website
pnpm bench     # performance comparison, several minutes
pnpm clean     # remove build output and test artifacts
```

Formatting and lint rules are in `.prettierrc.json` and `eslint.config.js`; the shared checks are in `packages/cli/scripts`.

## Design decisions

- **Components own their source.** Components use relative imports, native elements, Tailwind v4 utilities, and CVA variants. There are no Nook package dependencies in a downloaded component.
- **The browser owns the state.** Local helpers read `:popover-open` with `useSyncExternalStore`. A controlled `open` drives the browser, but the browser can still close an `auto` popover, because `beforetoggle` cannot cancel closing.
- **Relationships render on the server,** so open, close, and Escape work before hydration.
- **Tooltips use `interestfor`** (Chromium-only, accepted), plus an explicit ARIA relationship, because the native one exists only while the tooltip is open.
- **React Compiler:** `target: '19'`, `panicThreshold: 'none'` for the published build. Tests run against compiled and uncompiled code; correctness never depends on memoization. Lint and compiler reports can be false positives: fix real violations, and record justified exceptions inline with a reason.
- **Next:** menu (keyboard model; `focusgroup` was not available in Chromium 145), hover card, toast (`ariaNotify`), select, combobox.

## Browser-support policy

Build on native capabilities first. Support in only a few browsers, including Chromium-only, experimental, or flag-gated features, is acceptable. Add no polyfills or fallbacks. Record each feature's capabilities, versions, and gaps in [docs/research.md](docs/research.md), and verify the behavior the design depends on with a test. Limited support never excuses broken accessibility for what is implemented.

## License

[MIT](LICENSE), copyright Nook contributors.
