import { usePopover, useTooltip } from '@nook/react'
import { useState } from 'react'
import { Demo, Icon, useUnsupported } from './shared'

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
                className="nk-icon-btn"
                type="button"
                onClick={() => setClicks(clicks + 1)}
            >
                <Icon name="more" />
            </button>

            <ul className="nk-log" aria-label="State">
                <li className={hint.open ? 'nk-log__open' : undefined}>tooltip: {hint.open ? 'open' : 'closed'}</li>
                <li className={actions.open ? 'nk-log__open' : undefined}>
                    popover: {actions.open ? 'open' : 'closed'}
                </li>
                <li>your onClick ran {clicks}×</li>
            </ul>

            <div {...hint.contentProps} className="nk-tooltip nk-animated">
                Project actions
            </div>

            <div {...actions.contentProps} className="nk-panel nk-animated">
                <span className="nk-panel__eyebrow">Atlas project</span>
                <h3 {...actions.titleProps} className="nk-panel__title">
                    Project actions
                </h3>
                <p className="nk-panel__text">
                    One ordinary button with a click popover, a hover tooltip, and your own handler.
                </p>
            </div>
        </Demo>
    )
}
