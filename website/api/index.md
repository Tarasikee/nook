---
title: API reference
description: Every option and return value of @nook/react and @nook/core.
---

# API reference

<p class="nk-lead">Both hooks return plain attribute objects to spread onto your own elements. Trigger props contain no event handlers and no ref.</p>

```ts
import { usePopover, useTooltip } from '@nook/react'
```

## usePopover

A click popover on `popovertarget`. Guide: [Popover](../guide/popover).

| Option         | Type                      | Default   | Description                                                                                  |
| -------------- | ------------------------- | --------- | -------------------------------------------------------------------------------------------- |
| `mode`         | `'auto' \| 'manual'`      | `'auto'`  | `'auto'` light-dismisses; `'manual'` closes only through the trigger, `closeProps`, or code. |
| `open`         | `boolean`                 |           | Controlled state. The browser can still close an `'auto'` popover.                           |
| `defaultOpen`  | `boolean`                 | `false`   | Opens once after mount. Ignored when `open` is set.                                          |
| `onOpenChange` | `(open: boolean) => void` |           | Called after every native state change.                                                      |
| `id`           | `string`                  | `useId()` | Content element id.                                                                          |

| Returns                        | Spread onto / type | Contents                                                         |
| ------------------------------ | ------------------ | ---------------------------------------------------------------- |
| `triggerProps`                 | `<button>`         | `popoverTarget`, `data-open` while open                          |
| `contentProps`                 | popover surface    | `id`, `popover`, `aria-labelledby`, `ref`                        |
| `titleProps`                   | its heading        | `id`                                                             |
| `closeProps`                   | `<button>` inside  | `popoverTarget`, `popoverTargetAction: 'hide'`                   |
| `open`                         | `boolean`          | The browser's actual state; `false` on the server                |
| `show()`, `hide()`, `toggle()` | `() => void`       | Drive the native popover; showing passes the trigger as `source` |

## useTooltip

A tooltip on `interestfor` (Chromium 142+). Delays are CSS. Guide: [Tooltip](../guide/tooltip).

| Option         | Type                       | Default         | Description                                                             |
| -------------- | -------------------------- | --------------- | ----------------------------------------------------------------------- |
| `role`         | `'description' \| 'label'` | `'description'` | Renders `aria-describedby`, or `aria-labelledby` for icon-only buttons. |
| `onOpenChange` | `(open: boolean) => void`  |                 | Called after the tooltip shows or hides.                                |
| `id`           | `string`                   | `useId()`       | Tooltip element id.                                                     |

| Returns        | Spread onto / type          | Contents                                               |
| -------------- | --------------------------- | ------------------------------------------------------ |
| `triggerProps` | `<button>`, `<a>`, `<area>` | `interestfor`, `aria-describedby` or `aria-labelledby` |
| `contentProps` | tooltip element             | `id`, `popover: 'hint'`, `role: 'tooltip'`, `ref`      |
| `open`         | `boolean`                   | The browser's actual state                             |

## Core

`@nook/core` is framework-agnostic and has no dependencies. The hooks are built on it; use it for other bindings.

| Export                                   | Description                                                                                                                                                                                        |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createPopoverStore()`                   | Native popover state as an external store: `attach` (a React 19 ref callback), `subscribe`, `getSnapshot`, `onChange`, `setOpen` (deferred until attached), `control` (reapplied on every attach). |
| `observePopover(popover, onChange)`      | Reports native state changes; skips merged events that end where they started. Returns a cleanup function.                                                                                         |
| `setPopoverOpen(popover, open, source?)` | Shows or hides; when showing, passes the invoker as `source` so the popover stays anchored.                                                                                                        |
| `findPopoverInvoker(popover)`            | First element with `popovertarget`, `commandfor`, or `interestfor` pointing at the popover.                                                                                                        |
| `isPopoverOpen(element)`                 | Whether it matches `:popover-open`.                                                                                                                                                                |
