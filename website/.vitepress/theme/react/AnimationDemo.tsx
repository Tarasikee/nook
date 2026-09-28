import { usePopover } from '@nook/react'
import { Demo, useUnsupported } from './shared'

export function AnimationDemo() {
    const unsupported = useUnsupported(['popover'])
    const plain = usePopover()
    const animated = usePopover()

    return (
        <Demo
            title="Animation"
            badge="@starting-style"
            hint="Both popovers use the same hook. Only the CSS differs. Reduced-motion preferences turn the transition off."
            unsupported={unsupported}
        >
            <button {...plain.triggerProps} className="nk-btn nk-btn--ghost" type="button">
                No transition
            </button>
            <button {...animated.triggerProps} className="nk-btn nk-btn--primary" type="button">
                With transition
            </button>

            <div {...plain.contentProps} className="nk-panel">
                <h3 {...plain.titleProps} className="nk-panel__title">
                    Instant
                </h3>
                <p className="nk-panel__text">The popover appears and disappears with display changes only.</p>
            </div>

            <div {...animated.contentProps} className="nk-panel nk-animated">
                <h3 {...animated.titleProps} className="nk-panel__title">
                    Transitioned
                </h3>
                <p className="nk-panel__text">
                    <code>@starting-style</code> sets the entry state; <code>allow-discrete</code> keeps it visible while
                    it fades out.
                </p>
            </div>
        </Demo>
    )
}

