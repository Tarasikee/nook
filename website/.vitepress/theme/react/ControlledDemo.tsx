import { usePopover } from '@nook/react'
import { useState } from 'react'
import { Demo } from './Demo'
import * as kit from './kit.css'
import * as popover from './popover.css'
import { Icon, useUnsupported } from './shared'

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
            <button {...status.triggerProps} className={kit.button({ variant: 'secondary' })} type="button">
                <Icon name="bell" size={16} />
                Deployment status
            </button>

            <div className={kit.row} role="group" aria-label="React state">
                <button className={kit.chip} type="button" onClick={() => setOpen(true)}>
                    setOpen(true)
                </button>
                <button className={kit.chip} type="button" onClick={() => setOpen(false)}>
                    setOpen(false)
                </button>
                <span className={kit.state} data-open={status.open ? '' : undefined}>
                    open → {String(status.open)}
                </span>
            </div>

            <div {...status.contentProps} className={`${popover.panel} ${popover.animated}`}>
                <span className={popover.eyebrow}>Production · main</span>
                <h3 {...status.titleProps} className={popover.title}>
                    Everything is live.
                </h3>
                <p className={popover.text}>This panel stays open until your application closes it.</p>
                <div className={popover.actions}>
                    <button
                        {...status.closeProps}
                        className={kit.button({ variant: 'ghost', size: 'small' })}
                        type="button"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </Demo>
    )
}
