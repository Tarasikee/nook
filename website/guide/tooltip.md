---
title: Tooltip
description: Tooltips on native interest invokers, their delays, groups, and accessibility.
---

# Tooltip <span class="nk-pill">Chromium 142+</span>

<p class="nk-lead">A short, non-interactive hint the browser shows on hover, focus, or long press through <code>interestfor</code>. Props are in the <a href="../api/#usetooltip">API reference</a>.</p>

<ReactDemo name="tooltip" :height="260" />

```tsx
const tooltip = useTooltip({ role: 'label' })

<button {...tooltip.triggerProps}><BoldIcon aria-hidden /></button>
<div {...tooltip.contentProps} className="tooltip">Bold</div>
```

## What the browser does, and what Nook adds

The browser decides when the user shows interest, shows the `popover="hint"` target, hides it when interest ends or on <kbd>Esc</kbd>, and anchors it to the trigger. Nook installs no listeners or timers.

Chromium exposes the tooltip text to assistive technology only **while the tooltip is open**, so a screen reader hears nothing until the delay passes. The hook adds a relationship that always exists: `role: 'description'` (default) renders `aria-describedby` for extra text, and `role: 'label'` renders `aria-labelledby` for icon-only buttons.

## Delays

Delays are CSS, not options:

```css
[interestfor] {
  interest-delay: 300ms 100ms; /* show after 300ms, hide after 100ms */
}
```

## Tooltip groups

In a toolbar, the first tooltip should wait, but the next should appear at once. Add one rule:

```css
.toolbar:has(:interest-source) [interestfor] {
  interest-delay-start: 0s;
}
```

How it works:

1. The first hover waits the normal delay, because nothing in the toolbar has interest yet.
2. While a tooltip shows, its trigger matches `:interest-source`, so the toolbar matches the rule and every trigger in it opens with no delay.
3. Moving to the next button keeps the toolbar matched for the length of the hide delay, so the next tooltip opens at once. Opening a hint closes the previous one.
4. Once the pointer has been away longer than the hide delay, the rule stops matching and the full delay returns.

The hide delay is the switching window: longer means more forgiving, but tooltips also linger longer. Use `:root:has(:interest-source)` to group every tooltip on the page. Verified in Chromium 145 with timed tests; the toolbar above uses this rule.

## With a popover on the same button

A `hint` does not close an open auto popover, and both hooks return attributes only:

<ReactDemo name="combined" :height="280" />

## Good to know

- Triggers must be `<button>`, `<a>`, or `<area>`.
- Keep tooltips short and non-interactive; use a [popover](./popover) for interactive content.
- Without `interestfor` support, tooltips never appear, but the ARIA relationship still gives their text to assistive technology.
