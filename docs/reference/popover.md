# Popover API

Verified: **2026-09-28**. Read alongside [compatibility](browser-compatibility.md).

## Native responsibilities

The Popover API exposes content above normal page content and supports declarative or programmatic control. Popovers are non-modal: using the API does not make the rest of the document inert or establish a modal focus trap. A dialog can carry `popover` for dialog semantics while remaining non-modal; modal interactions need the dialog modal mechanism. [MDN API overview](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)

## Modes

| Attribute | Intended native behavior |
| --- | --- |
| `popover` / empty value / `auto` | Outside interaction and close requests can dismiss it. Opening another unrelated auto popover closes it; nesting can preserve ancestors. |
| `hint` | Dismissible like auto, but opening it preserves auto popovers and closes unrelated hints. Useful for transient supplementary content. |
| `manual` | Explicit show/hide/toggle control; no automatic light dismissal or close-request handling. Independent manual popovers can coexist. |

Hidden popovers use `display: none`. Open popovers enter the browser's top layer, escaping ancestor overflow clipping and ordinary stacking contexts. The top layer does not move their DOM nodes. `hint` does not itself install hover behavior; invocation is a separate concern. [MDN attribute reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover)

The attribute is enumerated. Missing means no popover; an invalid value maps to manual. This explains why unrecognized `hint` values behave as manual in browsers with only the older modes. Changing an open popover's attribute to a different state invokes hiding. [HTML Standard](https://html.spec.whatwg.org/multipage/popover.html#the-popover-attribute)

## Invocation and focus

- A button or button-type input uses `popovertarget` to reference the target ID. `popovertargetaction` selects show, hide, or toggle; toggle is the default.
- Buttons can alternatively use `commandfor` with `show-popover`, `hide-popover`, or `toggle-popover`. Check its separate support row. [MDN button reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button)
- A declarative popover invoker establishes implicit expanded/details relationships for assistive technology and integrates the target into focus navigation after the invoker. Keyboard dismissal returns focus to the invoker.
- Programmatic `source` establishes focus navigation and anchoring, but does not establish the same implicit ARIA relationship.
- Nesting can follow DOM ancestry or an invoker inside a parent popover. Current behavior treats an auto popover opened under a hint as an effective hint.
- Successful modal-dialog or fullscreen activation elsewhere can dismiss auto popovers.

For focus, nesting, and dismissal details, see the [MDN usage guide](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using). Its `anchor` HTML attribute example should not be treated as a portable nesting recipe; investigate that feature separately before adopting it.

## JavaScript surface

| Surface | Purpose / caveat |
| --- | --- |
| `HTMLElement.popover` | Reflects the mode, not whether the popover is currently open. |
| `popoverTargetElement`, `popoverTargetAction` | DOM counterparts of declarative targeting on buttons and button-type inputs. |
| `showPopover({ source })` | Shows the target; an optional source identifies its invoker. Returns undefined. |
| `hidePopover()` | Hides the target. Returns undefined. |
| `togglePopover()` | Toggles visibility. |
| `togglePopover(force)` | Requests a specific state; already in that state is a no-op. |
| `togglePopover({ force, source })` | Adds explicit state and invoker options, with later compatibility than the original method. |
| `:popover-open` | CSS selector for native open state, also usable through DOM selector matching. |

The toggle method returns the resulting boolean state in current implementations; older ones can return undefined. Presence of `togglePopover` alone does not establish support for every overload. References: [showPopover](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/showPopover), [hidePopover](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/hidePopover), [togglePopover](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/togglePopover), and [usage guide](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using).

## Events and synchronization

`beforetoggle` precedes a transition. Its `oldState` and `newState` are `open` or `closed`. **Only opening is cancelable; closing is not.** The usage guide's general suggestion that either direction can be prevented is too broad. Use the dedicated [beforetoggle reference](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforetoggle_event).

`toggle` reports a completed state change and cannot be canceled. Rapid changes can be coalesced into a single event, so one call does not guarantee one notification. It is not an animation-completion signal. [MDN toggle reference](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/toggle_event)

`ToggleEvent.source` identifies the initiating control when available, or is null when there is none. Its availability is newer than `ToggleEvent`; do not assume it exists wherever basic popovers work. [MDN source reference](https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent/source)

## Lifecycle pitfalls

The current standard makes repeated show-on-open and hide-on-hidden operations return without a state change. The usage guide still describes errors for these cases. Missing popover configuration can cause `NotSupportedError`; disconnected elements, inactive documents, modal dialogs, and fullscreen elements can cause `InvalidStateError`. Reentrant operations during another show/hide also have restrictions. Check the specific algorithm and browser version rather than relying on the guide's shorthand. [HTML Standard algorithms](https://html.spec.whatwg.org/multipage/popover.html#dom-showpopover)

## Implications to investigate for Nook

- Let browser dismissal participate in state management. A React binding must observe native changes rather than assume all changes come from React handlers.
- Test nested interactions and hints against the exact support baseline; older hint engines implement different stack rules.
- Prefer native invoker relationships where they meet the use case. DOM placement and invoker relationships matter when considering portals.
- Treat open state, rendered presence during exit transitions, and framework mounting as separate lifecycle concerns.
- Verify keyboard, pointer, touch, focus restoration, disconnected nodes, and rapid state changes before defining wrapper guarantees.
- Popover presentation alone does not implement a menu, tooltip, or select interaction model. Decide semantics and keyboard behavior for each feature.

These are research prompts, not a prescribed API.
