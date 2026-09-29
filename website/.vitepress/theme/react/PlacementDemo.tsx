import { usePopover } from '@nook/react'
import { useState, type CSSProperties } from 'react'
import { Demo } from './Demo'
import * as kit from './kit.css'
import * as styles from './PlacementDemo.css'
import { useAnchorPositioning, useUnsupported } from './shared'

const placements = [
    'top span-left',
    'top',
    'top span-right',
    'left',
    'right',
    'bottom span-left',
    'bottom',
    'bottom span-right'
]

export function PlacementDemo() {
    const [placement, setPlacement] = useState('bottom')
    const unsupported = useUnsupported(['popover'])
    const anchored = useAnchorPositioning()
    const preview = usePopover({ mode: 'manual' })

    const choose = (value: string) => {
        setPlacement(value)
        preview.show()
    }

    return (
        <Demo
            title="Placement"
            badge="position-area"
            hint={
                anchored
                    ? 'Pick a placement. The popover is anchored to its trigger with CSS alone; no positioning JavaScript runs.'
                    : 'This browser does not support CSS anchor positioning, so the popover keeps the default centered placement.'
            }
            unsupported={unsupported}
        >
            <div className={styles.layout}>
                <div className={styles.options} role="group" aria-label="Placement">
                    {placements.map((value) => (
                        <button
                            key={value}
                            className={kit.chip}
                            type="button"
                            aria-pressed={placement === value}
                            onClick={() => choose(value)}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                <div className={styles.area}>
                    <button {...preview.triggerProps} className={kit.button({ variant: 'primary' })} type="button">
                        Anchor
                    </button>
                </div>
            </div>

            <div
                {...preview.contentProps}
                className={styles.placement}
                style={{ '--area': placement } as CSSProperties}
            >
                <code {...preview.titleProps}>position-area: {placement};</code>
            </div>
        </Demo>
    )
}
