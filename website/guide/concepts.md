---
title: Core concepts
description: The ideas behind Nook's hooks.
---

# Core concepts

<p class="nk-lead">When the browser already provides a behavior, render the HTML that asks for it instead of recreating it in JavaScript.</p>

## Hooks render relationships

A click popover is a relationship between a trigger and its content, and HTML already has one:

```html
<button popovertarget="share">Share</button>
<div id="share" popover>…</div>
```

`usePopover()` returns these attributes with a stable id; `useTooltip()` does the same with `interestfor`. The browser then handles activation, dismissal, focus, and anchoring.

## Attributes, not handlers

Nook adds no `onClick`, `onPointerEnter`, or ref to your trigger. So there is nothing to merge: spread several hooks on one element, in any order, next to your own handlers.

```tsx
<button {...actions.triggerProps} {...hint.triggerProps} onClick={track}>…</button>
```

This also works with your design system's `<Button>`, as long as it forwards props to a native button. A live example is on the [Tooltip](./tooltip#with-a-popover-on-the-same-button) page.

## The browser owns the state

An auto popover can close without React knowing: an outside click, <kbd>Esc</kbd>, or another popover opening. So Nook keeps no copy of the open state. The hooks read `:popover-open` through `useSyncExternalStore`, subscribed to the native `toggle` event. `open` is always the browser's actual state, and `onOpenChange` fires whatever caused the change.

Browsers can merge rapid changes into one `toggle` event. An event that ends in the state it started from is not reported.

## Server rendering

Because relationships are attributes with ids from `useId`, the server renders working HTML. Before hydration the trigger, close button, <kbd>Esc</kbd>, and outside clicks already work, and `popover` keeps content hidden, so nothing flashes. After hydration `open` reads the real state, so a popover opened before hydration is reported as open. The package entry is marked `'use client'`: call the hooks in client components.

## Top layer instead of portals

Open popovers render in the top layer, above `overflow: hidden` and stacking contexts. The element stays where you rendered it, so React context, event bubbling, and CSS inheritance keep working without a portal.

## Styleless

The hooks add attributes, never classes or styles. See [Positioning](./styling#positioning) and [Animation](./styling#animation). Semantics beyond what the hooks render, such as menu roles or focus trapping, are yours; see [Accessibility](./accessibility).
