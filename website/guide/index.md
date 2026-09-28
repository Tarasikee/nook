---
title: Introduction
description: What Nook is, and what the browser does instead.
---

# Introduction

<p class="nk-lead">Nook is a small set of headless React hooks for popovers and tooltips. It is built on native HTML and adds only what the platform does not provide yet.</p>

## The idea

Modern browsers already open, close, dismiss, layer, and anchor floating UI. `popovertarget` and `interestfor` connect a trigger to its content; light dismiss and <kbd>Esc</kbd> close it; the top layer renders it above everything; CSS anchor positioning places it.

What remains is small: connecting that native state to React, making accessibility relationships exist before a tooltip opens, naming popovers, and keeping them anchored when opened from code. That is Nook.

```tsx
const share = usePopover()
const hint = useTooltip()

<button {...share.triggerProps} {...hint.triggerProps}>Share</button>
```

## What Nook is not

- **A positioning engine.** Placement is CSS; see [Positioning](./styling#positioning).
- **A component library.** No styles, markup, or design tokens.
- **A polyfill.** Missing browser features are documented, not emulated; see [Browser support](./browser-support).

## Status and roadmap

Early implementation; the API may change. `@nook/react` provides `usePopover()` and `useTooltip()` for React 19.2+, and `@nook/core` holds the framework-agnostic store they share. The packages are private and not yet on npm.

Planned, in order:

- **Menu:** menu semantics, arrow keys, type-to-find, and submenus on native popovers. `focusgroup` could supply arrow keys natively but was not available in Chromium 145.
- **Hover card:** interactive content on `interestfor`, with different semantics than a tooltip.
- **Toast:** announcements with `ariaNotify()`.
- **Select:** built on the customizable native select, so form behavior stays native.
- **Combobox:** filtering and a listbox, which the platform does not provide.

<div class="nk-cards">
  <a class="nk-card" href="./getting-started"><strong>Quick start →</strong><span>Your first popover in a few minutes.</span></a>
  <a class="nk-card" href="./concepts"><strong>Core concepts →</strong><span>Attributes, native state, and the top layer.</span></a>
  <a class="nk-card" href="../examples/"><strong>Examples →</strong><span>Live, copy-ready patterns.</span></a>
</div>
