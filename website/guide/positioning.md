---
title: Positioning
description: Anchor popovers and tooltips to their triggers with CSS anchor positioning.
---

# Positioning

<p class="nk-lead">Nook has no positioning engine. The trigger is the popover's implicit anchor, so a few lines of CSS place, offset, and flip it: no measuring, no resize observers, no scroll listeners.</p>

<ReactDemo name="placement" :height="420" />

## The implicit anchor

The native invoker relationship makes the trigger the popover's **implicit anchor element**:

- `usePopover()` renders `popovertarget`.
- `useTooltip()` renders `interestfor`.
- `show()` and controlled opens pass the trigger as `source`.

So you don't need `anchor-name` or `position-anchor`. `position-area` on the popover is enough.

## Basic recipe

```css
.panel {
  /* 1. Remove the browser's default centered placement. */
  inset: auto;
  margin: 0;

  /* 2. Choose an area around the anchor. */
  position-area: block-end span-inline-end;

  /* 3. Offset it from the trigger. */
  margin-block-start: 8px;
}
```

::: warning Reset the defaults
Default popover styles include `inset: 0` and `margin: auto`, which center the popover in the viewport. Without the reset, `position-area` puts the popover in the right region but may stretch or center it inside that region.
:::

## Choosing a placement

`position-area` names a region of a 3×3 grid around the anchor. Physical and logical keywords both work.

| Goal | Value |
| --- | --- |
| Below, centered | `bottom` or `block-end` |
| Below, aligned to the start edge | `bottom span-right` or `block-end span-inline-end` |
| Above, centered | `top` or `block-start` |
| To the right | `right` or `inline-end` |
| To the left | `left` or `inline-start` |

## Offsets

Use margins on the side facing the anchor. For a popover that can appear on any side, one margin on all sides is simplest:

```css
.panel {
  margin: 8px; /* only the side facing the anchor has a visible effect */
}
```

## Flipping near the viewport edge

```css
.panel {
  position-area: block-end;
  position-try-fallbacks: flip-block; /* try above when there is no room below */
}
```

## Unsupported browsers

Without anchor positioning, the reset above would leave the popover at its static position. Wrap placement in `@supports` so those browsers keep the centered default:

```css
@supports (position-area: block-end) {
  .panel {
    inset: auto;
    margin: 0;
    position-area: block-end span-inline-end;
    margin-block-start: 8px;
    position-try-fallbacks: flip-block;
  }
}
```

## Anchoring to another element

```css
.toolbar {
  anchor-name: --toolbar;
}

.panel {
  position-anchor: --toolbar;
  position-area: block-end;
}
```

## Support

`position-area` is available from Chrome 129, Firefox 147, and Safari 26. The implicit anchor from `popovertarget` arrived in Chrome 133, Firefox 147, and Safari 26. See [Browser support](./browser-support).
