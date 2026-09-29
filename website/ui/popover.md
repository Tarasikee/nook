---
title: Popover
description: Nook's styled popover.
---

# Popover

<p class="nk-lead">Wrap a button to open a panel on click. Opening, closing, <kbd>Esc</kbd>, and outside clicks are native, through <code>popovertarget</code>.</p>

<ReactDemo name="ui-popover" :height="240" />

```tsx
<Popover
  title="Invite collaborators"
  content={
    <>
      <p>Anyone with the link can view this project.</p>
      <div className="nook-popover__actions">
        <PopoverClose>Done</PopoverClose>
      </div>
    </>
  }
>
  <Button variant="primary">Share</Button>
</Popover>
```

| Prop                                  | Description                                                               | Default           |
| ------------------------------------- | ------------------------------------------------------------------------- | ----------------- |
| `content`                             | The panel body                                                            | required          |
| `title`                               | Heading and accessible name of the panel                                  |                   |
| `mode`                                | `'auto'` closes on outside clicks and <kbd>Esc</kbd>; `'manual'` does not | `'auto'`          |
| `open`, `defaultOpen`, `onOpenChange` | Controlled or uncontrolled state, as in [usePopover](../api/#usepopover)  |                   |
| `side`, `align`                       | `top \| bottom \| left \| right`, `start \| center \| end`                | `bottom`, `start` |
| `panelProps`                          | Extra panel attributes, such as `aria-label` when there is no title       |                   |
| `children`                            | One `<button>`, `Button`, or `Tooltip` around a button                    | required          |

**PopoverClose** renders a small ghost `Button` that closes the panel natively; use it inside `content`.

## With a tooltip

`Tooltip` and `Popover` add only attributes to their child, so they nest in either order on one button:

```tsx
<Tooltip label="Project actions" asLabel>
  <Popover title="Project actions" content={<Actions />}>
    <Button icon><MoreIcon /></Button>
  </Popover>
</Tooltip>
```

Without a `title`, name the panel by passing `aria-label` in `panelProps`.
