---
title: Nook UI
description: Ready-made components in Nook's design language, built on the primitives.
---

# Nook UI

<p class="nk-lead">The primitives, with opinions: styled, accessible components you can drop in. The primitives stay available when you need full control.</p>

| Package          | What it is                                                                                                                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@nook/ui`       | Nook's design language as plain CSS: `nook.css` for everything, or component CSS (including `dialog.css`) alone. Works with plain HTML; the class names are also exported for TypeScript. |
| `@nook/ui-react` | `Button`, `Tooltip`, `TooltipGroup`, `Popover`, `PopoverClose`, `Dialog`, and `DialogClose`, built on native elements, `@nook/react`, and `@nook/ui`.                                     |

## Setup

Import the stylesheet once, then use the components:

```tsx
import '@nook/ui/nook.css'
import { Button, Tooltip } from '@nook/ui-react'

<Tooltip label="Save changes">
  <Button variant="primary">Save</Button>
</Tooltip>
```

## Principles

- **Native first.** Buttons are `<button>`, popovers use `popovertarget`, tooltips use `interestfor`, and dialogs use native `commandfor`. Placement, delays, grouping, and motion are CSS; the components add no event handlers to your elements.
- **Composes by wrapping.** `Tooltip` and `Popover` wrap one child and add only attributes to it, so they nest in either order on the same button.
- **Accessible by default.** Tooltips describe or name their trigger before they open, popovers are named by their title, and focus rings, reduced motion, and forced colors are handled.

## Theming

Override the `--nook-*` custom properties, for example `--nook-accent`, `--nook-radius`, or `--nook-tooltip-delay`. Add `.dark` or `data-theme="dark"` to an ancestor for dark mode.

## Without React

The CSS works on plain HTML:

```html
<button class="nook-button" data-variant="primary" popovertarget="share">Share</button>
<div id="share" class="nook-popover" popover aria-labelledby="share-title">
  <h2 id="share-title" class="nook-popover__title">Invite collaborators</h2>
</div>
```

Components: [Button](./button), [Tooltip](./tooltip), [Popover](./popover), [Dialog](../guide/dialog).
