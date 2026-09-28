# Nook React

Headless React hooks over native HTML primitives. Each hook returns plain attribute objects you spread onto your own elements. They contain no event handlers and no trigger refs, so hooks compose on one element without Slot, `cloneElement`, or prop merging.

Requires React 19.2+ (`useEffectEvent`). The package is private and its API may change.

```tsx
import { usePopover, useTooltip } from '@nook/react'

function ShareMenu() {
  const share = usePopover({ onOpenChange: (open) => track(open) })
  const hint = useTooltip()

  return (
    <>
      <button {...share.triggerProps} {...hint.triggerProps} onClick={trackClick}>
        Share
      </button>
      <div {...hint.contentProps}>Share with your team</div>

      <div {...share.contentProps} className="panel">
        <h2 {...share.titleProps}>Invite collaborators</h2>
        <button {...share.closeProps}>Done</button>
      </div>
    </>
  )
}
```

## `usePopover(options?)`

Renders the native `popovertarget` relationship. The trigger, close button, Escape, and light dismiss work in server-rendered HTML before hydration. After hydration the hook mirrors native state, including a popover opened before hydration.

| Option | Default | Description |
| --- | --- | --- |
| `mode` | `'auto'` | `'auto'` light-dismisses; `'manual'` closes only through the trigger, `closeProps`, or code. |
| `open` | | Controlled state. The browser can still close an `'auto'` popover (Escape, outside click); that is reported through `onOpenChange` and cannot be prevented. Use `'manual'` when your app must own closing. |
| `defaultOpen` | `false` | Opens once after mount. |
| `onOpenChange` | | Called after every native state change, whatever caused it. |
| `id` | `useId()` | Content element id. |

Returns `open` (the browser's actual state), `show()`, `hide()`, `toggle()`, and:

| Props | Spread onto | Contents |
| --- | --- | --- |
| `triggerProps` | `<button>` | `popoverTarget`, `data-open` while open |
| `contentProps` | popover surface | `id`, `popover`, `aria-labelledby` (title id), `ref` |
| `titleProps` | heading | `id` |
| `closeProps` | `<button>` inside | `popoverTarget`, `popoverTargetAction="hide"` |

`contentProps['aria-labelledby']` always points at the title id. Browsers ignore a missing id, so omitting the title leaves the popover unnamed rather than broken. The trigger's expanded state is exposed natively by `popovertarget`; the hook does not add `aria-expanded`. `show()` and controlled opens pass the trigger as the native `source`, which Chromium needs to anchor a script-opened popover.

## `useTooltip(options?)`

Renders `interestfor` on the trigger and `popover="hint"` with `role="tooltip"` on the content. The browser shows it on hover, focus, or long press and hides it on Escape. Timing comes from the CSS `interest-delay` property, not from options.

| Option | Default | Description |
| --- | --- | --- |
| `role` | `'description'` | `'description'` adds `aria-describedby`; `'label'` adds `aria-labelledby` for icon-only buttons. |
| `onOpenChange` | | Called after the tooltip is shown or hidden. |
| `id` | `useId()` | Tooltip element id. |

**Why the explicit ARIA:** in Chromium 145, `interestfor` exposes the tooltip text as the trigger's description only *while the tooltip is open*, so a screen reader focusing the trigger gets nothing until the delay passes. `aria-describedby` makes it available immediately. With `role: 'label'`, Chromium 145 exposes the same text as both name and description. Whether screen readers read it twice has not been verified.

**Support:** `interestfor` is Chromium-only (142+) and experimental. In other browsers the tooltip never appears, though the ARIA relationship still gives the description to assistive technology. Nook ships no fallback.

## Build and checks

- `pnpm build`: Babel with `babel-plugin-react-compiler` (`target: '19'`, `panicThreshold: 'none'`) emits `dist`, and `tsc` emits declarations. `'use client'` is preserved.
- `pnpm check:compiler`: lists compiler events and fails if an exported hook is not compiled, unless recorded with a reason in `scripts/check-compiler.mjs`.
- `pnpm test`: Playwright suite, run against both the compiled `dist` and uncompiled `src`, in React StrictMode with server rendering and hydration. It also checks Chromium's own accessibility tree via CDP, behavior before hydration, and returned-object identity. A separate `platform` project checks the browser behavior the design depends on.

Measured: with the compiler, `triggerProps` and `contentProps` keep their identity across unrelated re-renders; without it they do not. This is asserted in the tests.

## React Compiler

This package ships code compiled by React Compiler, so consumers get memoized output whether or not their app uses the compiler. Guidance comes from React's [Compiling Libraries](https://react.dev/reference/react-compiler/compiling-libraries) guide and the [`target`](https://react.dev/reference/react-compiler/target), [`panicThreshold`](https://react.dev/reference/react-compiler/panicThreshold), and [directives](https://react.dev/reference/react-compiler/directives) references, checked 2026-09-28 (guide source last changed 2025-10-10, react.dev commit `be77c2a`).

From React's guidance:

- The compiler runs first in the Babel pipeline.
- `target: '19'` needs no `react-compiler-runtime` dependency. React 17 or 18 support would need that package as a regular dependency; it is not planned.
- Test both the compiled output and a build that bypasses the compiler.
- `panicThreshold: 'none'` for the published build; stricter thresholds are debugging tools.
- `'use no memo'` opts a function out. Document the reason next to any use.

Nook decisions (not React requirements):

- Correctness never depends on memoization. The uncompiled test run must pass too.
- Compiler skips and lint reports can be false positives. Triage them: fix real Rules of React violations; for false positives, keep the clearer code and record the exception with its reason and any upstream issue link. Never contort correct code to satisfy the compiler.
- Claim "compiler optimized" only with build output and a measured effect as evidence.
- `eslint-plugin-react-hooks` compiler rules run in `pnpm lint`; see [Rules of React](#rules-of-react).

React code assumes React Compiler: do not use `useMemo`, `useCallback`, or `memo`.

See the [architecture direction](../../docs/architecture.md) and [contributor guide](../../CONTRIBUTING.md).
