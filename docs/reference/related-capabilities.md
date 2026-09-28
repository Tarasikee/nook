# Related browser capabilities

Verified: **2026-09-28**. Each capability needs its own [compatibility check](browser-compatibility.md).

## CSS anchor positioning

Anchor positioning separates placement from visibility. Named anchors use `anchor-name` and `position-anchor`; placement can use `position-area` or `anchor()` in inset properties. An implicit popover-invoker anchor can avoid a named association, but placement CSS is still needed. [MDN anchor positioning guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using)

Default popover centering can interfere with custom placement. Review the user-agent `margin` and `inset` values when authoring anchor styles. Native placement is not implied merely by adding `popover`. [MDN popover styling guide](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#styling_popovers)

Nook research: investigate placement fallbacks, viewport overflow, scroll containers, writing modes, zoom, and anchor disappearance when positioning work starts. Choose only the required CSS features rather than making a blanket claim about the entire anchor-positioning module.

## Entry and exit transitions

`@starting-style` supplies an entry style for an element's first rendered style or a transition out of `display: none`. Its cascade order and specificity still matter. [MDN starting-style reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style)

For popovers, transitioning `display` with `allow-discrete` preserves visibility through the exit. Transitioning `overlay` defers removal from the top layer until the transition finishes. The browser controls `overlay`; assigning it in author CSS cannot put arbitrary elements in the top layer. Backdrop transitions may need their own rules. [MDN overlay reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overlay)

Nook research: opening/closing should remain correct when animations are unavailable or disabled. Check reduced motion and interrupted transitions. Avoid treating `toggle` as an exit-animation completion event or unmounting before an intended native exit completes.

## Native selects

Customizable select research should begin with the native select rather than assuming a hand-built listbox. `appearance: base-select`, `::picker(select)`, and `<selectedcontent>` participate in this newer model; the picker has an implicit popover relationship and anchor. MDN notes framework integration and server-rendering caveats. These capabilities require separate support checks, and this snapshot does not establish a select-support baseline. [MDN customizable select guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select)

Nook research: preserve labeling, value submission, reset, validation, keyboard behavior, and disabled options before choosing how much custom behavior is needed. The existence of the Popover API alone does not provide these form-control responsibilities.

## Screen reader announcements

Verified: **2026-09-28**.

`Element.ariaNotify(announcement, { priority })` and `Document.ariaNotify()` queue text for screen readers without a live region. Announcements need no DOM change and no transient activation. `priority: 'normal'` (default) roughly matches `aria-live="polite"`; `'high'` roughly matches `assertive` and interrupts current speech. Live-region announcements still take precedence over `ariaNotify()`. The voice follows the nearest `lang`. An `aria-notify` Permissions Policy can silently block calls, including in iframes. Calls on elements the browser ignores in the accessibility tree (commonly `html` and `body`) may not announce; `document.ariaNotify()` is the safer global target. [MDN Element.ariaNotify](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaNotify), [ARIA spec](https://w3c.github.io/aria/#ARIANotifyMixin)

Caveats recorded by MDN and BCD:

- Multiple queued announcements are not guaranteed to be read in order; often only the most recent is spoken. Combine messages instead of firing several.
- On macOS, VoiceOver can drop an announcement when another accessibility event fires at the same time, for example a focus move when a popover opens. This affects every browser on macOS. [BCD issue 29610](https://github.com/mdn/browser-compat-data/issues/29610)
- On ChromeOS, Chrome exposes the method but never speaks announcements.

Nook research: consider `ariaNotify()` for toast announcements, combobox result counts, and confirmations such as "Copied", instead of hidden live-region nodes. Investigate announcement timing relative to focus changes, rate limiting (no user activation is required), and message coalescing. Its baseline is below the `hint` baseline Nook's tooltip already needs, so adopting it would not narrow support. Detection: `'ariaNotify' in Element.prototype`.
