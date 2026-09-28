---
title: useTooltip
description: API reference for useTooltip().
---

# useTooltip <span class="nk-pill">Chromium 142+</span>

<p class="nk-lead">A tooltip shown by the browser through the native <code>interestfor</code> attribute, with an accessibility relationship that exists before it opens.</p>

<div class="nk-signature">useTooltip(options?: UseTooltipOptions): UseTooltipResult</div>

## Options

| Option         | Type                       | Default         | Description                                                                                             |
| -------------- | -------------------------- | --------------- | ------------------------------------------------------------------------------------------------------- |
| `role`         | `'description' \| 'label'` | `'description'` | `'description'` renders `aria-describedby`; `'label'` renders `aria-labelledby`, for icon-only buttons. |
| `onOpenChange` | `(open: boolean) => void`  |                 | Called after the tooltip is shown or hidden.                                                            |
| `id`           | `string`                   | `useId()`       | The tooltip element's id.                                                                               |

Timing is not an option: use the CSS `interest-delay` property on the trigger.

## Returns

| Property       | Type                                                       | Description                                   |
| -------------- | ---------------------------------------------------------- | --------------------------------------------- |
| `open`         | `boolean`                                                  | The browser's actual state.                   |
| `triggerProps` | `{ interestfor, 'aria-describedby' \| 'aria-labelledby' }` | Spread onto a `<button>`, `<a>`, or `<area>`. |
| `contentProps` | `{ id, popover: 'hint', role: 'tooltip', ref }`            | Spread onto the tooltip element.              |

## Example

```tsx
const tooltip = useTooltip({ role: 'label' })

return (
  <>
    <button {...tooltip.triggerProps}><StarIcon aria-hidden /></button>
    <div {...tooltip.contentProps} className="tooltip">Star project</div>
  </>
)
```

See the [Tooltip guide](../guide/tooltip).
