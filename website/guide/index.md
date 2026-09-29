---
title: Introduction
description: What Nook is and where to find things.
---

# Introduction

<p class="nk-lead">Nook is a small set of headless React hooks for popovers and tooltips. The browser does the behavior; Nook adds what the platform leaves out.</p>

Browsers already open, close, dismiss, layer, and anchor floating UI: `popovertarget` and `interestfor` connect a trigger to its content, light dismiss and <kbd>Esc</kbd> close it, the top layer renders it above everything, and CSS anchor positioning places it. Nook connects that native state to React, adds the accessibility relationships the platform lacks, and keeps popovers anchored when opened from code.

Nook is not a positioning engine, a component library, or a polyfill.

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
