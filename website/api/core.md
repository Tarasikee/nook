---
title: Core helpers
description: API reference for @nook/core.
---

# Core helpers

<p class="nk-lead"><code>@nook/core</code> is framework-agnostic and has no dependencies. <code>@nook/react</code> is built on it, and other bindings can be too.</p>

## createPopoverStore()

A popover's native state as an external store. The browser stays the source of truth: `getSnapshot()` reads `:popover-open`.

```ts
const store = createPopoverStore()
const detach = store.attach(panel)       // also usable as a React 19 ref callback
const stop = store.subscribe(() => render(store.getSnapshot()))
store.setOpen(true)                      // deferred until attached
```

| Method | Description |
| --- | --- |
| `attach(element)` | Starts observing the element; returns a detach function. |
| `subscribe(listener)` | Called on state changes and on attach or detach. |
| `getSnapshot()` | Current open state; `false` when detached. |
| `onChange(listener)` | Called with the new state on native changes only. |
| `setOpen(open)` | Requests a state now, or once attached. |
| `control(open)` | Applies a controlled state now and on every later attach; `undefined` releases it. |

## Helpers

| Function | Description |
| --- | --- |
| `observePopover(popover, onChange)` | Reports native state changes; skips coalesced events that end where they started. Returns a cleanup function. |
| `setPopoverOpen(popover, open, source?)` | Shows or hides; a no-op if already in that state. When showing, passes the invoker as `source` so the popover stays anchored. |
| `findPopoverInvoker(popover)` | The first element with `popovertarget`, `commandfor`, or `interestfor` pointing at the popover. |
| `isPopoverOpen(element)` | Whether it matches `:popover-open`. |

