---
title: Button
description: Nook's native button.
---

# Button

<p class="nk-lead">A native <code>&lt;button&gt;</code> in Nook's style. Every prop you pass reaches the element.</p>

<ReactDemo name="ui-button" :height="200" />

```tsx
<Button variant="primary" onClick={save}>Save changes</Button>
```

| Prop      | Values                                | Default       |
| --------- | ------------------------------------- | ------------- |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'secondary'` |
| `size`    | `'medium' \| 'small'`                 | `'medium'`    |
| `icon`    | `boolean`, square for one icon        | `false`       |
| `type`    | native button type                    | `'button'`    |

Other props, including `ref`, go to the `<button>`.

- **Name icon buttons:** `aria-label`, or wrap them in a [Tooltip](./tooltip) with `asLabel`.
- **Plain HTML:** `<button class="nook-button" data-variant="primary">`.
