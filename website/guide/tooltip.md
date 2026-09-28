---
title: Tooltip
description: Hover and focus tooltips with useTooltip() on native interest invokers.
---

# Tooltip <span class="nk-pill">Chromium 142+</span>

<p class="nk-lead">A short, non-interactive hint the browser shows on hover, focus, or long press through <code>interestfor</code>. Timing is CSS.</p>

<div class="nk-meta">
  <span><strong>Hook</strong> <code>useTooltip</code></span>
  <span><strong>Native feature</strong> <code>interestfor</code>, <code>popover="hint"</code></span>
  <span><strong>API</strong> <a href="../api/use-tooltip">useTooltip()</a></span>
</div>

<ReactDemo name="tooltip" :height="260" />

## Usage

```tsx
const tooltip = useTooltip() // role: 'description'

<button {...tooltip.triggerProps}>Publish</button>
<div {...tooltip.contentProps} className="tooltip">Visible to everyone in your workspace</div>
```

```css
[interestfor] {
  interest-delay: 300ms 100ms; /* show, hide */
}
```

Position `.tooltip` with the [positioning recipe](./styling#positioning), using `position-area: block-start`.

## What the browser does, and what Nook adds

The browser decides when the user shows interest, shows the `popover="hint"` target, hides it when interest ends or on <kbd>Esc</kbd>, and anchors it to the trigger. Nook installs no listeners or timers.

In Chromium 145, `interestfor` exposes the tooltip text to assistive technology **only while the tooltip is open**. So the hook adds a relationship that always exists:

| `role`                      | Renders            | Use for                                          |
| --------------------------- | ------------------ | ------------------------------------------------ |
| `'description'` _(default)_ | `aria-describedby` | Extra text on a labeled control                  |
| `'label'`                   | `aria-labelledby`  | Icon-only buttons, where the tooltip is the name |

With `'label'`, Chromium also exposes the text as a description. Whether screen readers read it twice is unverified.

## With a popover on the same button

A `hint` doesn't close an open auto popover, and both hooks return attributes only:

```tsx
<button {...actions.triggerProps} {...hint.triggerProps}>…</button>
```

<ReactDemo name="combined" :height="280" />

## Guidelines

- Keep tooltips short and non-interactive; use a [popover](./popover) for interactive content.
- Triggers must be `<button>`, `<a>`, or `<area>`.
- In browsers without `interestfor`, the tooltip never appears, but its ARIA relationship remains. See [Browser support](./browser-support).
