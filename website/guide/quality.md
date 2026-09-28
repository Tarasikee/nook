---
title: Quality and React rules
description: How Nook is compiled, linted, and tested, and what has been measured.
---

# Quality and React rules

<p class="nk-lead">Nook's claims are checked by tools rather than taken on trust. This page lists what is enforced, what is measured, and the known gaps.</p>

## Rules of React

The hooks follow the Rules of React, enforced by `eslint-plugin-react-hooks` 7.1.1 with zero warnings allowed:

| Rule | What it forbids | How Nook complies |
| --- | --- | --- |
| [rules-of-hooks](https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks) | Hooks in conditions, loops, callbacks, or after early returns | Hooks are called unconditionally at the top level |
| [component-hook-factories](https://react.dev/reference/eslint-plugin-react-hooks/lints/component-hook-factories) | Functions that create components or hooks | Everything is defined at module level |
| [set-state-in-effect](https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect) | Synchronous `setState` in an effect | The hooks hold **no React state**. Native state is read with `useSyncExternalStore` |
| [set-state-in-render](https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-render) | Unconditional `setState` during render | No state setters exist |
| [static-components](https://react.dev/reference/eslint-plugin-react-hooks/lints/static-components) | Components defined inside components | Fixtures and demos are module-level |

The config also bans importing `useMemo`, `useCallback`, and `memo`, because React Compiler owns memoization.

**The lint was checked, not assumed.** It was run on a canary file. It reported synchronous `setState` in effects, including through a `useEffectEvent` called from the effect, a component created during render, and a banned import. It did **not** report a top-level function returning a hook, so `component-hook-factories` is not relied on alone for factories.

## React Compiler

`@nook/react` ships code compiled by React Compiler 1.0 (`target: '19'`, `panicThreshold: 'none'`), following React's [Compiling Libraries](https://react.dev/reference/react-compiler/compiling-libraries) guide.

- **Every hook is compiled.** A check lists compiler events and fails if an exported hook is skipped without a documented reason.
- **Measured, not assumed:** with the compiler, the props objects keep their identity across unrelated re-renders; without it they don't. A test asserts both.
- **Correct without it:** the full test suite runs against the compiled build and the uncompiled source.

## Tests

The Playwright suite, in Chromium:

- server rendering and markup checks with `renderToString`
- behavior with JavaScript disabled
- hydration in StrictMode with no warnings allowed
- controlled, manual, and uncontrolled state, including browser dismissal
- anchoring when opened from code
- Chromium's own accessibility tree over the DevTools protocol
- a separate set of **platform assumption** tests that fail if Chromium changes behavior the design depends on

## Size

Measured with esbuild, minified and gzipped, excluding React: `@nook/core` 573 B, and `@nook/react` including core 1,745 B.

## Known gaps

- Tests run in Chromium only; Firefox and Safari are not tested yet.
- Screen reader output has not been verified.
- Touch long press on tooltips has not been tested.

