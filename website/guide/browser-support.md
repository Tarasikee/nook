---
title: Browser support
description: Native capabilities Nook uses, their availability, and the no-fallback policy.
---

# Browser support

<p class="nk-lead">Nook uses native features directly and ships no polyfills or fallbacks. This page lists every capability the hooks and recipes rely on, so you can choose a browser baseline deliberately.</p>

## Policy

- **Native first.** Features are built on native capabilities, even when only one engine supports them. Chromium-only, experimental, and flag-gated features are acceptable when documented with browser, version, and flag.
- **No polyfills.** Missing features are documented, not emulated.
- **Degrade honestly.** Without `interestfor`, tooltips don't appear, but their ARIA relationship still gives the text to assistive technology.

## Support matrix

The version columns are the first stable release recorded for each capability. **This browser** runs a live check in the browser you're using now.

<SupportMatrix />

<p style="font-size: 0.85rem; color: var(--vp-c-text-3)">Source: MDN browser-compat-data (revision <a href="https://github.com/mdn/browser-compat-data/tree/a2d2a599a78df7885f57bfe21880d21821036dc5"><code>a2d2a59</code></a> and <code>main</code>), checked September 28, 2026. Version data is evidence, not a substitute for testing on your target devices.</p>

## By hook

| Hook | Needs | Effectively |
| --- | --- | --- |
| `usePopover()` | Popover API, `popovertarget` | Chrome 114, Firefox 125, Safari 17 |
| `useTooltip()` | `interestfor`, current `popover="hint"` | Chromium 142+ (hint semantics current from 151) |
| Positioning recipes | `position-area`, implicit anchor | Chrome 133, Firefox 147, Safari 26 |

## Caveats

::: warning interestfor is experimental
Compat data marks `interestfor` experimental and not on the standards track. It is in Chromium 142 and later only.
:::

- **`hint` semantics changed.** Chrome 133–150 and Firefox 149–152 implement an older `hint`. Current behavior starts at Chrome 151 and Firefox 153.
- **iOS light dismiss.** Outside taps did not dismiss popovers on iOS before 18.3.
- **`source` when opening from code.** Browsers without full support show the popover but may not anchor it.
- **CSS features ship separately.** `@starting-style` does not imply the `overlay` transition.

## What happens without support

| Missing | Effect |
| --- | --- |
| Popover API | Content is not hidden or shown as a popover. The demos on this site show a notice. |
| `interestfor` | Tooltips never appear; the ARIA relationship remains. |
| Anchor positioning | With `@supports`, popovers keep the default centered placement. |
| `@starting-style`, `transition-behavior` | Popovers open and close instantly. |

## Feature detection

```ts
const hasPopover = 'showPopover' in HTMLElement.prototype
const hasInterest = Object.hasOwn(HTMLButtonElement.prototype, 'interestForElement')
const hasAnchorPositioning = CSS.supports('position-area', 'top')
```

The repository's [browser API knowledge base](https://github.com/Tarasikee/nook/tree/main/docs/reference) records the research, sources, and observed behavior behind this page.
