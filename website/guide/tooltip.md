---
title: Tooltip
description: Hover and focus tooltips with useTooltip() on native interest invokers.
---

# Tooltip <span class="nk-pill">Chromium 142+</span>

<p class="nk-lead">A short, non-interactive hint shown by the browser on hover, focus, or long press through the native <code>interestfor</code> attribute. Timing is CSS. Nook adds the accessibility relationship the platform leaves out.</p>

<div class="nk-meta">
  <span><strong>Hook</strong> <code>useTooltip</code> from <code>@nook/react</code></span>
  <span><strong>Native feature</strong> <code>interestfor</code>, <code>popover="hint"</code></span>
  <span><strong>API</strong> <a href="../api/use-tooltip">useTooltip()</a></span>
</div>

<ReactDemo name="tooltip" :height="260" />

## Usage

::: code-group

```tsx [PublishButton.tsx]
import { useTooltip } from '@nook/react'

export function PublishButton() {
  const tooltip = useTooltip() // role: 'description' by default

  return (
    <>
      <button {...tooltip.triggerProps}>Publish</button>
      <div {...tooltip.contentProps} className="tooltip">
        Visible to everyone in your workspace
      </div>
    </>
  )
}
```

```css [tooltip.css]
[interestfor] {
  interest-delay: 300ms 100ms;
}

.tooltip {
  padding: 4px 8px;
  border: 0;
  border-radius: 6px;
  color: white;
  background: #0b2a2f;
}

@supports (position-area: block-start) {
  .tooltip {
    inset: auto;
    margin: 0;
    position-area: block-start;
    margin-block-end: 8px;
    position-try-fallbacks: flip-block;
  }
}
```

:::

## What the browser does

`interestfor` is an **interest invoker**. The browser decides when the user shows interest (hover, keyboard focus, long press), shows the `popover="hint"` target, and hides it when interest ends or on <kbd>Esc</kbd>. The trigger becomes the tooltip's implicit anchor. Nook installs no hover or focus listeners and no timers.

Timing is the CSS `interest-delay` property: one value for both directions, or two for show and hide. `:interest-source` and `:interest-target` let you style the active pair.

## What Nook adds

In Chromium 145, `interestfor` exposes the tooltip text as the trigger's description **only while the tooltip is open**. A screen reader user who focuses the button hears nothing until the delay passes. So the hook adds an explicit relationship that exists all the time:

| `role` | Renders | Use for |
| --- | --- | --- |
| `'description'` *(default)* | `aria-describedby` | Supplementary text on a labeled control |
| `'label'` | `aria-labelledby` | Icon-only buttons, where the tooltip is the name |

It also sets `role="tooltip"` and `popover="hint"` on the content, and reports state through `open` and `onOpenChange`.

::: info Label role and duplicate text
With `role: 'label'`, Chromium 145 exposes the text as both the name and the description. Whether screen readers read it twice has not been verified.
:::

## With a popover on the same button

`hint` popovers don't close open auto popovers, and both hooks return attributes only, so one button can have both:

```tsx
const actions = usePopover()
const hint = useTooltip({ role: 'label' })

<button {...actions.triggerProps} {...hint.triggerProps}>…</button>
```

<ReactDemo name="combined" :height="280" />

## Guidelines

- Keep tooltips **short and non-interactive**. For interactive content, use a [popover](./popover).
- Triggers must be `<button>`, `<a>`, or `<area>`: these are the elements that support `interestfor`.
- Never put essential information only in a tooltip.

## Browser support

`interestfor` is experimental and available only in Chromium 142 and later. In other browsers the tooltip does not appear, but the `aria-describedby` or `aria-labelledby` relationship still gives its text to assistive technology. Nook ships no fallback. See [Browser support](./browser-support).
