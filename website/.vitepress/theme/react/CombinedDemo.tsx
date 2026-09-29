import { usePopover, useTooltip } from '@nook/react'
import { useState } from 'react'
import { Demo } from './Demo'
import * as kit from './kit.css'
import * as popover from './popover.css'
import { Icon, useUnsupported } from './shared'

export function CombinedDemo() {
    const [clicks, setClicks] = useState(0)
    const unsupported = useUnsupported(['popover', 'interest'])
    const actions = usePopover()
    const hint = useTooltip({ role: 'label' })

    return (
        <Demo
            title="One trigger, two hooks"
            badge="spread both"
            hint="Hover for the tooltip, click for the panel. Both hooks return attributes only, so spreading them on one button never conflicts, and your onClick still runs."
            unsupported={unsupported}
        >
            <button
                {...actions.triggerProps}
                {...hint.triggerProps}
                className={kit.iconButton}
                type="button"
                onClick={() => setClicks(clicks + 1)}
            >
                <Icon name="more" />
            </button>

            <ul className={kit.log} aria-label="State">
                <li className={hint.open ? kit.logOpen : undefined}>tooltip: {hint.open ? 'open' : 'closed'}</li>
                <li className={actions.open ? kit.logOpen : undefined}>popover: {actions.open ? 'open' : 'closed'}</li>
                <li>your onClick ran {clicks}×</li>
            </ul>

            <div {...hint.contentProps} className={`${popover.tooltip} ${popover.animated}`}>
                Project actions
            </div>

            <div {...actions.contentProps} className={`${popover.panel} ${popover.animated}`}>
                <span className={popover.eyebrow}>Atlas project</span>
                <h3 {...actions.titleProps} className={popover.title}>
                    Project actions
                </h3>
                <p className={popover.text}>
                    One ordinary button with a click popover, a hover tooltip, and your own handler.
                </p>
            </div>
        </Demo>
    )
}
