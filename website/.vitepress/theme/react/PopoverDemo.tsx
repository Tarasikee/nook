import { usePopover } from '@nook/react'
import { useId, useState } from 'react'
import { Demo } from './Demo'
import * as kit from './kit.css'
import * as popover from './popover.css'
import { Icon, useUnsupported } from './shared'

export function PopoverDemo() {
    const linkId = useId()
    const [clicks, setClicks] = useState(0)
    const [events, setEvents] = useState<string[]>([])
    const [copyLabel, setCopyLabel] = useState('Copy')
    const unsupported = useUnsupported(['popover'])

    const share = usePopover({
        onOpenChange: (open) => setEvents((previous) => [`onOpenChange(${open})`, ...previous].slice(0, 3))
    })

    async function copy() {
        try {
            await navigator.clipboard.writeText('https://nook.dev/p/atlas')
            setCopyLabel('Copied')
        } catch {
            setCopyLabel('Copy failed')
        }
        setTimeout(() => setCopyLabel('Copy'), 1400)
    }

    return (
        <Demo
            title="Popover"
            badge="usePopover()"
            hint="Click Share, then close it with Escape or by clicking outside. The browser dismisses it; onOpenChange reports the result."
            unsupported={unsupported}
        >
            <button
                {...share.triggerProps}
                className={kit.button({ variant: 'primary' })}
                type="button"
                onClick={() => setClicks(clicks + 1)}
            >
                <Icon name="share" size={16} />
                Share
            </button>

            <ul className={kit.log} aria-label="Event log">
                <li>your onClick ran {clicks}×</li>
                {events.map((event, index) => (
                    <li key={`${events.length - index}`} className={event.includes('true') ? kit.logOpen : undefined}>
                        {event}
                    </li>
                ))}
                {events.length === 0 ? <li className={kit.logEmpty}>waiting for a toggle…</li> : null}
            </ul>

            <div {...share.contentProps} className={`${popover.panel} ${popover.animated}`}>
                <span className={popover.eyebrow}>Atlas project</span>
                <h3 {...share.titleProps} className={popover.title}>
                    Invite collaborators
                </h3>
                <p className={popover.text}>Anyone with this link can view the project.</p>
                <div className={kit.field}>
                    <label className={kit.srOnly} htmlFor={linkId}>
                        Project link
                    </label>
                    <input id={linkId} readOnly value="nook.dev/p/atlas" />
                    <button className={kit.button({ variant: 'primary', size: 'small' })} type="button" onClick={copy}>
                        {copyLabel}
                    </button>
                </div>
                <div className={popover.actions}>
                    <button
                        {...share.closeProps}
                        className={kit.button({ variant: 'ghost', size: 'small' })}
                        type="button"
                    >
                        Done
                    </button>
                </div>
            </div>
        </Demo>
    )
}
