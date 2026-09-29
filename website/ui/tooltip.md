---
title: Tooltip
description: Nook's styled tooltip and tooltip group.
---

# Tooltip <span class="nk-pill">Chromium 142+</span>

<p class="nk-lead">Wrap an element to give it a tooltip. Hover, focus, and long press come from the browser through <code>interestfor</code>.</p>

<ReactDemo name="ui-tooltip" :height="220" />

```tsx
<TooltipGroup role="toolbar" aria-label="Formatting">
  <Tooltip label="Bold" asLabel>
    <Button icon variant="ghost"><BoldIcon /></Button>
  </Tooltip>
</TooltipGroup>
```

| Prop            | Description                                                           | Default         |
| --------------- | --------------------------------------------------------------------- | --------------- |
| `label`         | Short, non-interactive text                                           | required        |
| `asLabel`       | The tooltip names the trigger (icon buttons) instead of describing it | `false`         |
| `side`, `align` | `top \| bottom \| left \| right`, `start \| center \| end`            | `top`, `center` |
| `onOpenChange`  | Called when it shows or hides                                         |                 |
| `children`      | One `<button>`, `<a>`, `Button`, or `Popover`                         | required        |

**TooltipGroup:** once one tooltip inside it shows, the next opens without the delay. It renders an unstyled `<div>` and passes every attribute through, so make it the element that holds the triggers: give it the `toolbar` role, a name, and your layout. In plain HTML, add the `nook-tooltip-group` class to that element. How the grouping works is explained in the [Tooltip guide](../guide/tooltip#tooltip-groups).

- **Delays:** `--nook-tooltip-delay` (300ms) and `--nook-tooltip-hide-delay` (100ms).
- **Accessibility:** the trigger is described (or named) by the label before the tooltip opens, and the tooltip has `role="tooltip"`. An existing `aria-describedby` on the child is kept.
- **Browsers:** without `interestfor`, the tooltip never appears, but its label still reaches assistive technology.
