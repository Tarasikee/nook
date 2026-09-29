import { usePopover, useTooltip } from '@nook/react'
import { useState, type CSSProperties } from 'react'
import * as styles from './HeroDemo.css'
import * as kit from './kit.css'
import * as popover from './popover.css'
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
        <div className={styles.hero}>
            <div className={styles.appWindow}>
                <div className={styles.chrome} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <p>atlas.app / roadmap</p>
                </div>

                <div className={styles.body}>
                    <div className={styles.header}>
                        <div>
                            <p className={styles.crumb}>Atlas · Q4</p>
                            <p className={styles.title}>Product roadmap</p>
                        </div>
                        <div className={`${styles.actions} ${popover.group}`}>
                            <button
                                {...star.triggerProps}
                                className={kit.iconButton}
                                type="button"
                                aria-pressed={starred}
                                onClick={() => setStarred(!starred)}
                            >
                                <Icon name="star" size={17} />
                            </button>
                            <button {...archive.triggerProps} className={kit.iconButton} type="button">
                                <Icon name="archive" size={17} />
                            </button>
                            <button
                                {...share.triggerProps}
                                className={kit.button({ variant: 'primary' })}
                                type="button"
                                onClick={() => setClicks(clicks + 1)}
                            >
                                <Icon name="share" size={16} />
                                Share
                            </button>
                        </div>
                    </div>

                    <ul className={styles.rows} aria-hidden="true">
                        <li>
                            <i className={styles.bar} style={{ '--w': '72%' } as CSSProperties} />
                            <b className={styles.status.pending}>In progress</b>
                        </li>
                        <li>
                            <i className={styles.bar} style={{ '--w': '54%' } as CSSProperties} />
                            <b className={styles.status.done}>Shipped</b>
                        </li>
                        <li>
                            <i className={styles.bar} style={{ '--w': '64%' } as CSSProperties} />
                            <b className={styles.status.pending}>Planned</b>
                        </li>
                        <li>
                            <i className={styles.bar} style={{ '--w': '40%' } as CSSProperties} />
                            <b className={styles.status.pending}>Planned</b>
                        </li>
                    </ul>
                </div>

                <div className={styles.footer} aria-live="polite">
                    <span className={kit.state} data-open={share.open ? '' : undefined}>
                        popover {share.open ? 'open' : 'closed'}
                    </span>
                    <span>your onClick ran {clicks}×</span>
                    <span className={styles.last}>{last}</span>
                </div>

                {unsupported ? (
                    <div className={styles.unsupported} role="status">
                        {unsupported}
                    </div>
                ) : null}
            </div>

            <div {...star.contentProps} className={`${popover.tooltip} ${popover.animated}`}>
                {starred ? 'Unstar project' : 'Star project'}
            </div>
            <div {...archive.contentProps} className={`${popover.tooltip} ${popover.animated}`}>
                Archive project
            </div>

            <div {...share.contentProps} className={styles.sharePanel}>
                <h3 {...share.titleProps} className={popover.title}>
                    Share “Product roadmap”
                </h3>
                <ul className={styles.people}>
                    {people.map((person) => (
                        <li key={person.initials}>
                            <span
                                className={styles.avatar}
                                style={{ '--hue': person.hue } as CSSProperties}
                                aria-hidden="true"
                            >
                                {person.initials}
                            </span>
                            <span className={styles.name}>{person.name}</span>
                            <span className={styles.role}>{person.role}</span>
                        </li>
                    ))}
                </ul>
                <div className={popover.actions}>
                    <button
                        className={kit.button({ variant: 'secondary', size: 'small' })}
                        type="button"
                        onClick={copy}
                    >
                        <Icon name="link" size={14} />
                        {copyLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
