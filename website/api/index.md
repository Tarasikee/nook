---
title: API reference
description: Every export of @nook/react and @nook/core.
---

# API reference

<p class="nk-lead"><code>@nook/react</code> exports two hooks. Both return plain attribute objects you spread onto your own elements. <code>@nook/core</code> holds the framework-agnostic pieces they are built on.</p>

```ts
import { usePopover, useTooltip } from '@nook/react'
```

<div class="nk-cards">
  <a class="nk-card" href="./use-popover"><code>usePopover(options?)</code><span>A click popover on <code>popovertarget</code>: auto or manual, controlled or not.</span></a>
  <a class="nk-card" href="./use-tooltip"><code>useTooltip(options?)</code><span>A hover and focus tooltip on <code>interestfor</code>, with an ARIA link that exists while closed.</span></a>
  <a class="nk-card" href="./core"><code>@nook/core</code><span>The popover store and DOM helpers, for other bindings.</span></a>
</div>

## At a glance

|                  | `usePopover`                | `useTooltip`                      |
| ---------------- | --------------------------- | --------------------------------- |
| Opens on         | Trigger activation (native) | Hover, focus, long press (native) |
| Native attribute | `popovertarget`             | `interestfor`                     |
| Popover mode     | `'auto'` or `'manual'`      | `'hint'`                          |
| Trigger element  | `<button>`                  | `<button>`, `<a>`, `<area>`       |
| Controlled       | `open`, `defaultOpen`       | No                                |
| Browser          | Popover API                 | Chromium 142+                     |

Both hooks return `open`, the browser's actual state read with `useSyncExternalStore`, and accept `onOpenChange` and `id`.

## Core helpers

<p class="nk-lead"><code>@nook/core</code> is framework-agnostic and has no dependencies. <code>@nook/react</code> is built on it, and other bindings can be too.</p>

## createPopoverStore()

A popover's native state as an external store. The browser stays the source of truth: `getSnapshot()` reads `:popover-open`.

```ts
const store = createPopoverStore()
const detach = store.attach(panel)       // also usable as a React 19 ref callback
const stop = store.subscribe(() => render(store.getSnapshot()))
store.setOpen(true)                      // deferred until attached
```

| Method                | Description                                                                        |
| --------------------- | ---------------------------------------------------------------------------------- |
| `attach(element)`     | Starts observing the element; returns a detach function.                           |
| `subscribe(listener)` | Called on state changes and on attach or detach.                                   |
| `getSnapshot()`       | Current open state; `false` when detached.                                         |
| `onChange(listener)`  | Called with the new state on native changes only.                                  |
| `setOpen(open)`       | Requests a state now, or once attached.                                            |
| `control(open)`       | Applies a controlled state now and on every later attach; `undefined` releases it. |

## Helpers

| Function                                 | Description                                                                                                                   |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `observePopover(popover, onChange)`      | Reports native state changes; skips coalesced events that end where they started. Returns a cleanup function.                 |
| `setPopoverOpen(popover, open, source?)` | Shows or hides; a no-op if already in that state. When showing, passes the invoker as `source` so the popover stays anchored. |
| `findPopoverInvoker(popover)`            | The first element with `popovertarget`, `commandfor`, or `interestfor` pointing at the popover.                               |
| `isPopoverOpen(element)`                 | Whether it matches `:popover-open`.                                                                                           |
