---
title: Introduction
description: What Nook is, what the browser does, and what Nook adds.
---

# Introduction

<p class="nk-lead">Nook is a small set of headless React hooks for popovers and tooltips. It is built on native HTML (<code>popovertarget</code>, <code>interestfor</code>, the top layer) and adds only what the platform does not provide yet.</p>

<ReactDemo name="popover" :height="330" />

## The idea

Modern browsers can already open, close, dismiss, layer, and anchor floating UI:

- **Invokers.** `popovertarget` connects a real button to its popover, including keyboard activation, focus order, and the expanded state for assistive technology. `interestfor` shows a hint on hover, focus, or long press.
- **Light dismiss.** Outside clicks and <kbd>Esc</kbd> close auto popovers.
- **The top layer.** Open popovers render above everything, regardless of `overflow` or `z-index`.
- **CSS anchor positioning.** The trigger is the popover's implicit anchor, so `position-area` places it without JavaScript.

What remains is small but real: connecting these features to React state, making ARIA relationships exist before a tooltip opens, naming popovers, and opening them from code without losing their anchor. That is Nook.

```tsx
import { usePopover, useTooltip } from '@nook/react'

const share = usePopover()
const hint = useTooltip()

<button {...share.triggerProps} {...hint.triggerProps}>Share</button>
```

## Principles

- **HTML does the behavior.** Hooks render attributes; the browser acts on them. Everything works in server-rendered HTML before hydration.
- **Attributes, not handlers.** Trigger props contain no event handlers or refs, so hooks compose on one element without Slot, `cloneElement`, or prop merging.
- **The browser owns the state.** Open state is read from `:popover-open`, never mirrored into React state from effects.
- **Styleless.** Placement, animation, and appearance are your CSS.
- **Verified, not assumed.** Platform behavior the design relies on is checked in tests, including Chromium's own accessibility tree.

## What Nook is not

- **A positioning engine.** Placement is CSS. See [Positioning](./positioning).
- **A component library.** No styles, markup, or design tokens.
- **A polyfill.** Unsupported browsers are not patched; gaps are documented in [Browser support](./browser-support).

## Status

Nook is in **early implementation**. The API may change while it is tested in real interfaces.

| Package | Status | Contents |
| --- | --- | --- |
| `@nook/react` | Available (private) | `usePopover()`, `useTooltip()` for React 19.2+ |
| `@nook/core` | Available (private) | Framework-agnostic helpers and a popover store |
| Menu, select | Planned | See the [roadmap](./roadmap) |

Packages are private and not yet published to npm. Names are provisional.

## Next steps

<div class="nk-cards">
  <a class="nk-card" href="./getting-started"><strong>Quick start →</strong><span>Your first popover and tooltip in a few minutes.</span></a>
  <a class="nk-card" href="./concepts"><strong>Core concepts →</strong><span>Attributes, native state, and server rendering.</span></a>
  <a class="nk-card" href="../api/"><strong>API reference →</strong><span>Every option and return value.</span></a>
  <a class="nk-card" href="../examples/"><strong>Examples →</strong><span>Copy-ready patterns with live previews.</span></a>
</div>
