import { usePopover } from '@nook/react'
import { Demo } from './Demo'
import * as kit from './kit.css'
import * as popover from './popover.css'
import { useUnsupported } from './shared'

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
            <button {...plain.triggerProps} className={kit.button({ variant: 'ghost' })} type="button">
                No transition
            </button>
            <button {...animated.triggerProps} className={kit.button({ variant: 'primary' })} type="button">
                With transition
            </button>

            <div {...plain.contentProps} className={popover.panel}>
                <h3 {...plain.titleProps} className={popover.title}>
                    Instant
                </h3>
                <p className={popover.text}>The popover appears and disappears with display changes only.</p>
            </div>

            <div {...animated.contentProps} className={`${popover.panel} ${popover.animated}`}>
                <h3 {...animated.titleProps} className={popover.title}>
                    Transitioned
                </h3>
                <p className={popover.text}>
                    <code>@starting-style</code> sets the entry state; <code>allow-discrete</code> keeps it visible
                    while it fades out.
                </p>
            </div>
        </Demo>
    )
}
