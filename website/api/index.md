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

| | `usePopover` | `useTooltip` |
| --- | --- | --- |
| Opens on | Trigger activation (native) | Hover, focus, long press (native) |
| Native attribute | `popovertarget` | `interestfor` |
| Popover mode | `'auto'` or `'manual'` | `'hint'` |
| Trigger element | `<button>` | `<button>`, `<a>`, `<area>` |
| Controlled | `open`, `defaultOpen` | No |
| Browser | Popover API | Chromium 142+ |

Both hooks return `open`, the browser's actual state read with `useSyncExternalStore`, and accept `onOpenChange` and `id`.
