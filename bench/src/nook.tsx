import { usePopover, useTooltip } from '@nook/react'
import type { ReactNode } from 'react'

export type ItemProps = { index: number; label: string }

export function Item({ index, label }: ItemProps) {
    const popover = usePopover()
    const tooltip = useTooltip({ role: 'description' })

    return (
        <div className="item">
            <button {...popover.triggerProps} {...tooltip.triggerProps} className="trigger">
                {label}
            </button>
            <div {...tooltip.contentProps} className="tip">
                Tooltip {index}
            </div>
            <div {...popover.contentProps} className="panel">
                <h3 {...popover.titleProps}>Panel {index}</h3>
                <p>Content</p>
            </div>
        </div>
    )
}

export function Provider({ children }: { children: ReactNode }) {
    return <>{children}</>
}
