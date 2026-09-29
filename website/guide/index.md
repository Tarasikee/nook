---
title: Introduction
description: What Nook is and where to find things.
---

# Introduction

<p class="nk-lead">Build popovers and tooltips with native HTML and headless React hooks.</p>

`popovertarget` and `interestfor` link triggers to content. The browser handles opening, dismissal, and placement; Nook exposes the native state to React, adds ARIA relationships, and anchors popovers opened from code.

Use the hooks without styles, or use the optional [styled components](../ui/). Nook ships no polyfills.

## Where to look

| I want to…                                     | Page                                 |
| ---------------------------------------------- | ------------------------------------ |
| Build a first popover                          | [Quick start](./getting-started)     |
| Understand the design                          | [Concepts](./concepts)               |
| Use modes, controlled state, or open from code | [Popover](./popover)                 |
| Set tooltip delays, groups, or ARIA roles      | [Tooltip](./tooltip)                 |
| Place, flip, or animate                        | [Styling](./styling)                 |
| Check roles, labels, and what is verified      | [Accessibility](./accessibility)     |
| Know which browsers work                       | [Browser support](./browser-support) |
| Compare with Radix and Floating UI             | [Performance](./performance)         |
| Use ready-made, styled components              | [Nook UI](../ui/)                    |
| Look up an option or return value              | [API reference](../api/)             |
| Copy a working pattern                         | [Examples](../examples/)             |

## Status and roadmap

Early implementation; the API may change. `@nook/react` has `usePopover()` and `useTooltip()` for React 19.2+, built on `@nook/core`. The packages are private and not on npm yet.

Planned: **menu** (roles, arrow keys, type-to-find; `focusgroup` was unavailable in Chromium 145), **hover card**, **toast** (`ariaNotify()`), **select** (customizable native select), and **combobox**.
