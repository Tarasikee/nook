import { usePopover } from '@nook/react'
import { useState } from 'react'
import { Demo, Icon, useUnsupported } from './shared'

export function ControlledDemo() {
    const [open, setOpen] = useState(false)
    const unsupported = useUnsupported(['popover'])
    const status = usePopover({ mode: 'manual', open, onOpenChange: setOpen })

    return (
        <Demo
            title="Controlled, manual"
            badge="open + onOpenChange"
            hint="A manual popover ignores outside clicks and Escape. React state drives it here, and the trigger and Dismiss button keep that state in sync through onOpenChange."
            unsupported={unsupported}
        >
            <button {...status.triggerProps} className="nk-btn nk-btn--secondary" type="button" data-testid="manual-trigger">
                <Icon name="bell" size={16} />
                Deployment status
            </button>

            <div className="nk-row" role="group" aria-label="React state">
                <button className="nk-chip" type="button" onClick={() => setOpen(true)}>
                    setOpen(true)
                </button>
                <button className="nk-chip" type="button" onClick={() => setOpen(false)}>
                    setOpen(false)
                </button>
                <span className="nk-state" data-open={status.open ? '' : undefined}>
                    open → {String(status.open)}
                </span>
            </div>

            <div {...status.contentProps} className="nk-panel nk-animated" data-testid="manual-content">
                <span className="nk-panel__eyebrow">Production · main</span>
                <h3 {...status.titleProps} className="nk-panel__title">
                    Everything is live.
                </h3>
                <p className="nk-panel__text">This panel stays open until your application closes it.</p>
                <div className="nk-panel__actions">
                    <button {...status.closeProps} className="nk-btn nk-btn--ghost nk-btn--small" type="button">
                        Dismiss
                    </button>
                </div>
            </div>
        </Demo>
    )
}

