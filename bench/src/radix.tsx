import * as Popover from '@radix-ui/react-popover'
import * as Tooltip from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'

export type ItemProps = { index: number; label: string }

export function Item({ index, label }: ItemProps) {
    return (
        <div className="item">
            <Popover.Root>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <Popover.Trigger className="trigger">{label}</Popover.Trigger>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content className="tip" side="top" sideOffset={8}>
                            Tooltip {index}
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
                <Popover.Portal>
                    <Popover.Content className="panel" side="bottom" align="start" sideOffset={8}>
                        <h3>Panel {index}</h3>
                        <p>Content</p>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </div>
    )
}

export function Provider({ children }: { children: ReactNode }) {
    return <Tooltip.Provider delayDuration={0}>{children}</Tooltip.Provider>
}
