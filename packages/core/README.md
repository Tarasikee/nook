# Nook core

Framework-independent DOM helpers for Nook's native primitives. No runtime dependencies.

Behavior comes from HTML: `popover`, `popovertarget`, `commandfor`, and `interestfor` handle opening, closing, light dismiss, Escape, focus return, layering, and anchoring. Core only covers what those attributes leave out: observing native state and opening popovers from script with the correct source. Framework bindings such as [`@nook/react`](../react/README.md) build on it.

```ts
import { findPopoverInvoker, isPopoverOpen, observePopover, setPopoverOpen } from '@nook/core'

const stop = observePopover(panel, (open) => console.log(open))
setPopoverOpen(panel, true) // passes the invoker as `source`, so the implicit anchor applies
stop()
```

| Export | Purpose |
| --- | --- |
| `observePopover(popover, onChange)` | Reports every native state change, whatever caused it. Coalesced `toggle` events that end in their starting state are not reported. Returns a cleanup function. |
| `setPopoverOpen(popover, open, source?)` | Shows or hides; a no-op when already in that state or disconnected. When showing, passes the invoker as `source`. Without it, Chromium does not anchor a script-opened popover to its trigger (verified in Chromium 145). |
| `findPopoverInvoker(popover)` | First element with `popovertarget`, `commandfor`, or `interestfor` pointing at the popover's `id`, in the same document or shadow root. |
| `isPopoverOpen(element)` | Whether the element matches `:popover-open`. |
| `createPopoverStore()` | The popover's native state as an external store: `attach` (usable as a React 19 ref callback), `subscribe`, `getSnapshot`, `onChange`, `setOpen` (deferred until attached), and `control` (reapplied on every attach). The browser stays the source of truth. `@nook/react` reads it with `useSyncExternalStore`. |
| `PopoverMode` | `'auto' \| 'manual' \| 'hint'` |

The earlier `createPopover()` and `createTooltip()` APIs were removed. Their jobs are done by native attributes (`popovertarget`, and `interestfor` with the CSS `interest-delay` property) plus these helpers.

Core is tested through the React package's Playwright suite. The package is private and its API may change. See the [architecture](../../docs/architecture.md) and [implementation direction](../../docs/implementation-direction.md).
