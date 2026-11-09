import { Popover } from '@base-ui/react/popover'
import { Tooltip } from '@base-ui/react/tooltip'
import type { ReactNode } from 'react'

export type ItemProps = { index: number; label: string }

export function Item({ index, label }: ItemProps) {
    return (
        <div className="item">
            <Popover.Root>
                <Tooltip.Root>
                    <Tooltip.Trigger render={<Popover.Trigger className="trigger" />}>{label}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner side="top" sideOffset={8}>
                            <Tooltip.Popup className="tip">Tooltip {index}</Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
                <Popover.Portal>
                    <Popover.Positioner side="bottom" align="start" sideOffset={8}>
                        <Popover.Popup className="panel">
                            <h3>Panel {index}</h3>
                            <p>Content</p>
                        </Popover.Popup>
                    </Popover.Positioner>
                </Popover.Portal>
            </Popover.Root>
        </div>
    )
}

export function Provider({ children }: { children: ReactNode }) {
    return (
        <Tooltip.Provider delay={0} closeDelay={0}>
            {children}
        </Tooltip.Provider>
    )
}
