import { usePopover, useTooltip } from '@nook/react'
import { useState, type CSSProperties } from 'react'
import { Icon, useUnsupported } from './shared'

const people = [
    { initials: 'AK', role: 'Owner', name: 'Ana Kovač', hue: 160 },
    { initials: 'JM', role: 'Editor', name: 'Jonas Meyer', hue: 199 },
    { initials: 'SL', role: 'Viewer', name: 'Sara Lind', hue: 142 }
]

export function HeroDemo() {
    const [clicks, setClicks] = useState(0)
    const [starred, setStarred] = useState(false)
    const [last, setLast] = useState('idle')
    const [copyLabel, setCopyLabel] = useState('Copy link')
    const unsupported = useUnsupported(['popover'])

    const share = usePopover({ onOpenChange: (open) => setLast(`onOpenChange(${open})`) })
    const star = useTooltip({ role: 'label' })
    const archive = useTooltip({ role: 'label' })

    async function copy() {
        try {
            await navigator.clipboard.writeText('https://nook.dev/p/atlas')
            setCopyLabel('Copied')
        } catch {
            setCopyLabel('Copy failed')
        }
        setTimeout(() => setCopyLabel('Copy link'), 1400)
    }

    return (
        <div className="hero-demo">
            <div className="hero-demo__window">
                <div className="hero-demo__chrome" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <p>atlas.app / roadmap</p>
                </div>

                <div className="hero-demo__body">
                    <div className="hero-demo__header">
                        <div>
                            <p className="hero-demo__crumb">Atlas · Q4</p>
                            <p className="hero-demo__title">Product roadmap</p>
                        </div>
                        <div className="hero-demo__actions">
                            <button
                                {...star.triggerProps}
                                className="nk-icon-btn"
                                type="button"
                                aria-pressed={starred}
                                onClick={() => setStarred(!starred)}
                            >
                                <Icon name="star" size={17} />
                            </button>
                            <button {...archive.triggerProps} className="nk-icon-btn" type="button">
                                <Icon name="archive" size={17} />
                            </button>
                            <button
                                {...share.triggerProps}
                                className="nk-btn nk-btn--primary"
                                type="button"
                                onClick={() => setClicks(clicks + 1)}
                            >
                                <Icon name="share" size={16} />
                                Share
                            </button>
                        </div>
                    </div>

                    <ul className="hero-demo__rows" aria-hidden="true">
                        <li>
                            <i style={{ '--w': '72%' } as CSSProperties} />
                            <b>In progress</b>
                        </li>
                        <li>
                            <i style={{ '--w': '54%' } as CSSProperties} />
                            <b className="is-done">Shipped</b>
                        </li>
                        <li>
                            <i style={{ '--w': '64%' } as CSSProperties} />
                            <b>Planned</b>
                        </li>
                        <li>
                            <i style={{ '--w': '40%' } as CSSProperties} />
                            <b>Planned</b>
                        </li>
                    </ul>
                </div>

                <div className="hero-demo__status" aria-live="polite">
                    <span className="nk-state" data-open={share.open ? '' : undefined}>
                        popover {share.open ? 'open' : 'closed'}
                    </span>
                    <span>your onClick ran {clicks}×</span>
                    <span className="hero-demo__last">{last}</span>
                </div>

                {unsupported ? (
                    <div className="hero-demo__unsupported" role="status">
                        {unsupported}
                    </div>
                ) : null}
            </div>

            <div {...star.contentProps} className="nk-tooltip nk-animated">
                {starred ? 'Unstar project' : 'Star project'}
            </div>
            <div {...archive.contentProps} className="nk-tooltip nk-animated">
                Archive project
            </div>

            <div {...share.contentProps} className="nk-panel nk-animated hero-demo__panel">
                <h3 {...share.titleProps} className="nk-panel__title">
                    Share “Product roadmap”
                </h3>
                <ul className="hero-demo__people">
                    {people.map((person) => (
                        <li key={person.initials}>
                            <span
                                className="hero-demo__avatar"
                                style={{ '--hue': person.hue } as CSSProperties}
                                aria-hidden="true"
                            >
                                {person.initials}
                            </span>
                            <span className="hero-demo__name">{person.name}</span>
                            <span className="hero-demo__role">{person.role}</span>
                        </li>
                    ))}
                </ul>
                <div className="nk-panel__actions">
                    <button className="nk-btn nk-btn--secondary nk-btn--small" type="button" onClick={copy}>
                        <Icon name="link" size={14} />
                        {copyLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
