---
title: Examples
description: Live, copy-ready Nook patterns.
outline: [2, 2]
---

# Examples

<p class="nk-lead">Every preview runs on <code>@nook/react</code>. Only the CSS is specific to this site; see <a href="../guide/positioning">Positioning</a> and <a href="../guide/animation">Animation</a> for the recipes.</p>

## Share popover

<ReactDemo name="popover" :height="330" />

```tsx
const share = usePopover({ onOpenChange: (open) => log(open) })

<button {...share.triggerProps} onClick={trackClick}>Share</button>
<div {...share.contentProps} className="panel">
  <h3 {...share.titleProps}>Invite collaborators</h3>
  <p>Anyone with this link can view the project.</p>
  <button {...share.closeProps}>Done</button>
</div>
```

## Toolbar tooltips

<ReactDemo name="tooltip" :height="260" />

```tsx
function Tool({ icon, label, pressed, onToggle }) {
  const tooltip = useTooltip({ role: 'label' })
  return (
    <>
      <button {...tooltip.triggerProps} aria-pressed={pressed} onClick={onToggle}>{icon}</button>
      <div {...tooltip.contentProps} className="tooltip">{label}</div>
    </>
  )
}
```

## Popover and tooltip on one button

<ReactDemo name="combined" :height="280" />

```tsx
const actions = usePopover()
const hint = useTooltip({ role: 'label' })

<button {...actions.triggerProps} {...hint.triggerProps} onClick={track}>…</button>
```

## Controlled manual panel

<ReactDemo name="controlled" :height="300" />

```tsx
const [open, setOpen] = useState(false)
const status = usePopover({ mode: 'manual', open, onOpenChange: setOpen })
```

## Placement playground

<ReactDemo name="placement" :height="420" />

```css
.popover {
  inset: auto;
  margin: 8px;
  position-area: var(--placement, bottom);
}
```

## Animated popover

<ReactDemo name="animation" :height="300" />
