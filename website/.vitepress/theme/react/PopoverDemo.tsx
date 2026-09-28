import { usePopover } from '@nook/react'
import { useId, useState } from 'react'
import { Demo, Icon, useUnsupported } from './shared'

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
                className="nk-btn nk-btn--primary"
                type="button"
                onClick={() => setClicks(clicks + 1)}
            >
                <Icon name="share" size={16} />
                Share
            </button>

            <ul className="nk-log" aria-label="Event log">
                <li>your onClick ran {clicks}×</li>
                {events.map((event, index) => (
                    <li
                        key={`${events.length - index}`}
                        className={event.includes('true') ? 'nk-log__open' : undefined}
                    >
                        {event}
                    </li>
                ))}
                {events.length === 0 ? <li className="nk-log__empty">waiting for a toggle…</li> : null}
            </ul>

            <div {...share.contentProps} className="nk-panel nk-animated">
                <span className="nk-panel__eyebrow">Atlas project</span>
                <h3 {...share.titleProps} className="nk-panel__title">
                    Invite collaborators
                </h3>
                <p className="nk-panel__text">Anyone with this link can view the project.</p>
                <div className="nk-field">
                    <label className="nk-sr-only" htmlFor={linkId}>
                        Project link
                    </label>
                    <input id={linkId} readOnly value="nook.dev/p/atlas" />
                    <button className="nk-btn nk-btn--primary nk-btn--small" type="button" onClick={copy}>
                        {copyLabel}
                    </button>
                </div>
                <div className="nk-panel__actions">
                    <button {...share.closeProps} className="nk-btn nk-btn--ghost nk-btn--small" type="button">
                        Done
                    </button>
                </div>
            </div>
        </Demo>
    )
}
