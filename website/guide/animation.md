---
title: Animation
description: Entry and exit transitions for native popovers with @starting-style.
---

# Animation

<p class="nk-lead">Popovers switch between <code>display: none</code> and a rendered state. Modern CSS transitions across that switch, so animation needs no JavaScript and no delayed unmounting.</p>

<ReactDemo name="animation" :height="300" />

## Recipe

```css
.panel {
  /* Closed state, also the exit target. */
  opacity: 0;
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
    /* Where the entry transition starts. */
    opacity: 0;
    translate: 0 -4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel {
    transition: none;
  }
}
```

The same recipe works for tooltips. You can also key it off `:interest-target`.

## How each piece works

| Piece | Purpose |
| --- | --- |
| `:popover-open` | Matches while the browser considers the popover open. |
| `@starting-style` | The "before" style for the first frame after leaving `display: none`. |
| `display … allow-discrete` | Keeps the popover rendered until the exit transition finishes. |
| `overlay … allow-discrete` | Keeps it in the top layer during the exit transition. |

::: tip Order matters
Put `@starting-style` **after** the `:popover-open` rule. Both have the same specificity, so the later one wins for the first frame.
:::

## Things to know

- **Content stays mounted.** The hooks never unmount your content on close, so exit transitions just work. `onOpenChange` fires when the state changes, not when the animation ends.
- **`overlay` support is limited.** Without it, the exit transition still runs, but the popover may leave the top layer early. See [Browser support](./browser-support).
- **Respect reduced motion.** Nook never waits for animations, so turning them off is always safe.
