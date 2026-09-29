---
title: Styling
description: Position and animate popovers and tooltips with CSS alone.
---

# Styling

<p class="nk-lead">Use CSS anchor positioning for placement and transitions for animation. The hooks add no styles.</p>

## Positioning

<ReactDemo name="placement" :height="420" />

The native invoker makes the trigger the **implicit anchor**: `popovertarget` from `usePopover()`, `interestfor` from `useTooltip()`, and the `source` passed by `show()`. So `position-area` is enough, with no `anchor-name` needed:

```css
@supports (position-area: block-end) {
  .panel {
    inset: auto; /* remove the default centered placement */
    margin: 0;
    position-area: block-end span-inline-end;
    margin-block-start: 8px; /* offset from the trigger */
    position-try-fallbacks: flip-block; /* flip above when there is no room below */
  }
}
```

- **Reset first.** Default popover styles (`inset: 0; margin: auto`) center it in the viewport and would stretch it inside the chosen area.
- **`@supports`** keeps the centered default in browsers without anchor positioning, instead of a popover stuck at its static position.
- **Placement:** `position-area` names a cell of a 3×3 grid around the anchor. Logical keywords (`block-end span-inline-end`) and physical ones (`bottom span-right`) both work.
- **Offsets:** a margin on the side facing the anchor. `margin: 8px` on all sides works for any placement.
- **Another anchor:** set `anchor-name: --toolbar` on the element and `position-anchor: --toolbar` on the popover.

## Animation

<ReactDemo name="animation" :height="300" />

```css
.panel {
  opacity: 0; /* closed state, also the exit target */
  translate: 0 -4px;
  transition:
    opacity 160ms ease-out,
    translate 160ms ease-out,
    display 160ms allow-discrete,
    overlay 160ms allow-discrete;
}

.panel:popover-open {
  opacity: 1;
  translate: 0 0;
}

@starting-style {
  .panel:popover-open {
    opacity: 0; /* where the entry starts; must come after the rule above */
    translate: 0 -4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel {
    transition: none;
  }
}
```

- `@starting-style` supplies the first frame after leaving `display: none`. `display` and `overlay` with `allow-discrete` keep the popover rendered and in the top layer during the exit.
- Content stays mounted, so exit transitions just work. `onOpenChange` fires on the state change, not when the animation ends.
- The same recipe works for tooltips, or key it off `:interest-target`.

Browser versions for these properties, including limited `overlay` support, are on [Browser support](./browser-support).
