---
title: Browser support
description: What each hook needs, and what happens without it.
---

# Browser support

<p class="nk-lead">Nook uses native features directly and ships no polyfills. Features that only one engine supports are acceptable when documented.</p>

- **`usePopover()`** needs the Popover API: Chrome 114, Firefox 125, Safari 17.
- **`useTooltip()`** needs `interestfor`: Chromium 142+, experimental. Current `hint` behavior needs Chrome 151 or Firefox 153.
- **Positioning** needs `position-area` and the implicit invoker anchor: Chrome 133, Firefox 147, Safari 26.

<SupportMatrix />

<p style="font-size: 0.85rem; color: var(--vp-c-text-3)">Versions are the first stable release in MDN browser-compat-data, checked September 28, 2026. "This browser" is a live check.</p>

## Without support

| Missing                      | Effect                                                                   |
| ---------------------------- | ------------------------------------------------------------------------ |
| Popover API                  | Content is not shown as a popover.                                       |
| `interestfor`                | Tooltips never appear; their ARIA relationship remains.                  |
| Anchor positioning           | With `@supports`, popovers keep the default centered placement.          |
| `@starting-style`, `overlay` | Popovers open and close without animation, or leave the top layer early. |

Other caveats: older `hint` engines (Chrome 133–150, Firefox 149–152) behave differently; iOS did not dismiss on outside taps before 18.3; older browsers may not anchor popovers opened from code.

## Detect support

```ts
const hasPopover = 'showPopover' in HTMLElement.prototype
const hasInterest = Object.hasOwn(HTMLButtonElement.prototype, 'interestForElement')
const hasAnchorPositioning = CSS.supports('position-area', 'top')
```

Sources and observed behavior: [browser research](https://github.com/Tarasikee/nook/blob/main/docs/research.md).
