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
