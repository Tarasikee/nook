---
title: Core concepts
description: The design principles behind Nook's hooks.
---

# Core concepts

<p class="nk-lead">One principle: when the browser already provides a behavior, render the HTML that asks for it instead of recreating it in JavaScript.</p>

## Hooks render relationships

A click popover is a relationship between a trigger and its content, and HTML already has one:

```html
<button popovertarget="share">Share</button>
<div id="share" popover>…</div>
```

`usePopover()` returns exactly these attributes, with a stable id from `useId`. Once they are in the DOM, the browser provides:

- toggling on click, <kbd>Enter</kbd>, and <kbd>Space</kbd>
- the expanded state for assistive technology
- focus order that continues from the trigger into the popover
- focus returning to the trigger when <kbd>Esc</kbd> closes it
- an implicit anchor for [CSS positioning](./positioning)

`useTooltip()` does the same with `interestfor`, which gives hover, focus, long press, Escape, and CSS-controlled delays.

## Attributes, not handlers

Many libraries attach behavior by cloning your element, wrapping it in a Slot, or asking you to route handlers through prop getters. Nook needs none of that, because what it adds to your trigger is attributes only: no `onClick`, no `onPointerEnter`, no ref.

```tsx
const actions = usePopover()
const hint = useTooltip()

<button {...actions.triggerProps} {...hint.triggerProps} onClick={track}>…</button>
```

Spread order doesn't matter, nothing is overwritten, and your design system's `<Button>` works as long as it forwards props to a native button.

<ReactDemo name="combined" :height="280" />

## The browser owns the state

An auto popover can close without React knowing: an outside click, <kbd>Esc</kbd>, another popover opening. So Nook never keeps its own copy of the open state.

The hooks read `:popover-open` through `useSyncExternalStore`, subscribed to the native `toggle` event. `open` is always the browser's actual state, and no effect ever sets React state to mirror it. `onOpenChange` is called from the native event, whatever caused it.

::: info Coalesced toggles
Browsers can merge rapid changes into one `toggle` event. An event that ends in the state it started from is not a change, so Nook does not report it.
:::

## Top layer instead of portals

Open popovers render in the **top layer**, above `overflow: hidden` ancestors and stacking contexts. The element stays where you rendered it, so React context, event bubbling, and CSS inheritance keep working. No portal needed.

## Styleless by design

The hooks add attributes, never classes or styles. Placement, size, color, and animation are your CSS. See [Positioning](./positioning) and [Animation](./animation).

## What stays your responsibility

A popover is **non-modal** and has no implicit role. Nook does not add `role="dialog"` or `role="menu"`, trap focus, or implement menu arrow keys. Choose the semantics your content has; see [Accessibility](./accessibility).
