# Browser API knowledge base

Last researched: **2026-09-28**. These notes support future Nook development; no library behavior has been implemented or tested.

Project direction: build the main native features first and document limited browser availability. Compatibility fixes, polyfills, and fallback implementations are deferred for now; support gaps in these notes are not blockers. See the [architecture](../architecture.md#browser-support-approach).

## Read by task

| Topic | Reference |
| --- | --- |
| Modes, invokers, focus, events, lifecycle, and edge cases | [Popover API](popover.md) |
| Native hover/focus interactions and tooltip research | [Interest invokers](interest-invokers.md) |
| Positioning, transitions, native select, and screen reader announcements (`ariaNotify`) | [Related browser capabilities](related-capabilities.md) |
| Versions, partial implementations, and feature detection | [Browser compatibility](browser-compatibility.md) |

## Starting sources

- [MDN: popover attribute and compatibility](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover#browser_compatibility)
- [MDN: Using the Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using)
- [MDN: Using interest invokers](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers)

Each topic links further primary references. The notes summarize facts in our own words rather than mirroring MDN articles or examples.

## Keeping this useful

1. Read the relevant topic and compatibility rows together. An API name existing does not establish support for its newer options or interaction semantics.
2. Revisit MDN references, MDN browser-compat-data (BCD), and the linked standards before making implementation or support decisions.
3. Record the verification date and BCD revision when updating version claims. Distinguish released, partial, preview, and unsupported features.
4. When a guide and a dedicated API reference disagree, check the normative algorithm and record the disagreement. Verify behavior in the intended browser versions before promising it.
5. Keep browser facts separate from Nook design suggestions. Suggestions here are questions to investigate, not decisions about the public API or package structure. Follow the project's current approach of deferring browser compatibility work.

This is a manually maintained snapshot. It does not update automatically and is not a replacement for browser or assistive-technology testing.
