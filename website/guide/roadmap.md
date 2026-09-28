---
title: Roadmap
description: What exists, what is planned, and which decisions are open.
---

# Roadmap

<p class="nk-lead">Nook grows one verified interaction at a time. This page separates what exists from what is planned.</p>

## Available now

- [`usePopover()`](../api/use-popover): click popovers, auto or manual, controlled or uncontrolled
- [`useTooltip()`](../api/use-tooltip): hover and focus tooltips on `interestfor` (Chromium)
- [Core helpers](../api/core): a framework-agnostic popover store for other bindings

## Menu

A menu primitive: `role="menu"` semantics, arrow-key navigation, type-to-find, close on selection, and submenus, on top of native popovers. The proposed `focusgroup` attribute could provide arrow-key navigation natively. It was not available in Chromium 145, so Nook would provide the keyboard model until it is.

## Select

Built on the **customizable native select** (`appearance: base-select`, `::picker(select)`, `<selectedcontent>`), so labeling, form submission, reset, validation, and keyboard behavior stay native.

## Also planned

- **Hover card:** interactive content on `interestfor`. Moving the pointer into the target keeps it open (verified in Chromium 145), but it needs different semantics than a tooltip.
- **Toast:** announcements with `ariaNotify()`, available in Chrome 141, Firefox 150, and Safari 27.
- **Combobox:** filtering and a listbox pattern, which the platform does not provide.
- **Wider testing:** Firefox and Safari runs, and screen reader verification.

## Open decisions

- Final package names and publishing
- Whether to add thin components on top of the hooks
- Bindings for other frameworks, on the same core store

Follow progress or contribute on [GitHub](https://github.com/Tarasikee/nook).
