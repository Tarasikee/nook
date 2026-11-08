import { usePopover, usePopoverOpen, useTooltip } from '@nook/ui/hooks'
import { useState } from 'react'
import { Demo } from './Demo'
import * as kit from './kit'
import * as popover from './popover'
import { Icon, useUnsupported } from './shared'

export function CombinedDemo() {
    const [clicks, setClicks] = useState(0)
    const unsupported = useUnsupported(['popover', 'interest'])
    const actions = usePopover()
    const hint = useTooltip({ role: 'label' })
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
    const [tip, setTip] = useState<HTMLDivElement | null>(null)
    const popoverOpen = usePopoverOpen(panel)
    const tooltipOpen = usePopoverOpen(tip)

    return (
        <Demo
            title="One trigger, two hooks"
            badge="spread both"
            hint="Hover for the tooltip, click for the panel. The hooks return native attributes. This example also opts into observing their open state; your onClick still runs."
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
                <li className={tooltipOpen ? kit.logOpen : undefined}>tooltip: {tooltipOpen ? 'open' : 'closed'}</li>
                <li className={popoverOpen ? kit.logOpen : undefined}>popover: {popoverOpen ? 'open' : 'closed'}</li>
                <li>your onClick ran {clicks}×</li>
            </ul>

            <div {...hint.contentProps} ref={setTip} className={`${popover.tooltip} ${popover.animated}`}>
                Project actions
            </div>

            <div {...actions.contentProps} ref={setPanel} className={`${popover.panel} ${popover.animated}`}>
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
