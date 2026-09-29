---
title: Concepts
description: The ideas behind Nook's hooks.
---

# Concepts

<p class="nk-lead">When the browser already provides a behavior, render the HTML that asks for it instead of recreating it in JavaScript.</p>

## Hooks render relationships

`usePopover()` returns `popovertarget` and `popover` attributes; `useTooltip()` returns `interestfor` and `popover="hint"`. Once they are in the DOM, the browser handles activation, dismissal, focus order, focus return, and the implicit anchor.

## Attributes, not handlers

Trigger props contain no event handlers and no ref. Spread several hooks on one element, in any order, next to your own handlers, with no Slot or prop merging:

```tsx
<button {...actions.triggerProps} {...hint.triggerProps} onClick={track}>…</button>
```

Your design system's `<Button>` works if it forwards props to a native button.

## The browser owns the state

A popover can close without React knowing, for example on an outside click or <kbd>Esc</kbd>. So Nook keeps no copy of the state: the hooks read `:popover-open` through `useSyncExternalStore`, and `onOpenChange` fires on every native change. When the browser merges a quick open and close into one event, nothing is reported.

## Server rendering

Relationships are attributes with ids from `useId`, so server-rendered HTML already works before hydration, and `popover` keeps content hidden so nothing flashes. After hydration, `open` reads the real state, including a popover opened before hydration. Call the hooks in client components; the package is marked `'use client'`.

## Top layer, no portals

Open popovers render in the top layer, above `overflow: hidden` and stacking contexts. The element stays where you rendered it, so context, events, and CSS inheritance keep working.

## Styleless

The hooks add no classes or styles. Placement and animation are your CSS; see [Styling](./styling). Semantics beyond what the hooks render are yours; see [Accessibility](./accessibility).
