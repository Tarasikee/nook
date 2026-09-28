import { usePopover, useTooltip } from '@nook/react'
import { useEffect, useState } from 'react'

declare global {
    interface Window {
        nookEvents?: string[]
        nookIdentities?: unknown[]
    }
}

function record(event: string) {
    if (typeof window !== 'undefined') {
        window.nookEvents ??= []
        window.nookEvents.push(event)
    }
}

function UncontrolledPopover() {
    const [clicks, setClicks] = useState(0)
    const popover = usePopover({ onOpenChange: (open) => record(`popover:${open}`) })

    return (
        <main>
            <button {...popover.triggerProps} id="trigger" type="button" onClick={() => setClicks(clicks + 1)}>
                Share
            </button>
            <output id="clicks">{clicks}</output>
            <output id="state">{String(popover.open)}</output>
            <button id="show" type="button" onClick={popover.show}>
                show()
            </button>
            <div {...popover.contentProps} className="panel">
                <h2 {...popover.titleProps}>Invite collaborators</h2>
                <button {...popover.closeProps} id="close" type="button">
                    Done
                </button>
            </div>
        </main>
    )
}

function ControlledPopover({ mode }: { mode: 'auto' | 'manual' }) {
    const [open, setOpen] = useState(false)
    const popover = usePopover({
        mode,
        open,
        onOpenChange: (next) => {
            record(`controlled:${next}`)
            setOpen(next)
        }
    })

    return (
        <main>
            <button {...popover.triggerProps} id="trigger" type="button">
                Status
            </button>
            <button id="external-open" type="button" onClick={() => setOpen(true)}>
                Open from state
            </button>
            <button id="external-close" type="button" onClick={() => setOpen(false)}>
                Close from state
            </button>
            <output id="state">{String(popover.open)}</output>
            <output id="controlled">{String(open)}</output>
            <div {...popover.contentProps} className="panel">
                <h2 {...popover.titleProps}>Status</h2>
            </div>
        </main>
    )
}

function DefaultOpenPopover() {
    const popover = usePopover({ defaultOpen: true })

    return (
        <main>
            <button {...popover.triggerProps} id="trigger" type="button">
                Tips
            </button>
            <output id="state">{String(popover.open)}</output>
            <div {...popover.contentProps} className="panel">
                <h2 {...popover.titleProps}>Tips</h2>
            </div>
        </main>
    )
}

function Tooltips() {
    const described = useTooltip({ onOpenChange: (open) => record(`tooltip:${open}`) })
    const labelled = useTooltip({ role: 'label' })

    return (
        <main>
            <button {...described.triggerProps} id="described" type="button">
                Publish
            </button>
            <div {...described.contentProps} className="tooltip">
                Visible to everyone in your workspace
            </div>
            <output id="state">{String(described.open)}</output>

            <button {...labelled.triggerProps} id="labelled" type="button">
                ★
            </button>
            <div {...labelled.contentProps} className="tooltip">
                Star project
            </div>
        </main>
    )
}

function Combined() {
    const popover = usePopover({ onOpenChange: (open) => record(`popover:${open}`) })
    const tooltip = useTooltip({ onOpenChange: (open) => record(`tooltip:${open}`) })

    return (
        <main>
            <button {...popover.triggerProps} {...tooltip.triggerProps} id="trigger" type="button">
                Actions
            </button>
            <div {...tooltip.contentProps} className="tooltip">
                Project actions
            </div>
            <div {...popover.contentProps} className="panel">
                <h2 {...popover.titleProps}>Actions</h2>
            </div>
        </main>
    )
}

function Identity() {
    const [count, setCount] = useState(0)
    const popover = usePopover()

    useEffect(() => {
        window.nookIdentities ??= []
        window.nookIdentities.push(popover.triggerProps, popover.contentProps)
    })

    return (
        <main>
            <button id="rerender" type="button" onClick={() => setCount(count + 1)}>
                Re-render {count}
            </button>
            <button {...popover.triggerProps} id="trigger" type="button">
                Trigger
            </button>
            <div {...popover.contentProps} className="panel" />
        </main>
    )
}

function Unmount() {
    const [mounted, setMounted] = useState(true)

    return (
        <main>
            <button id="unmount" type="button" onClick={() => setMounted(false)}>
                Unmount
            </button>
            {mounted ? <UncontrolledPopover /> : null}
        </main>
    )
}

export const fixtures = {
    uncontrolled: UncontrolledPopover,
    'controlled-auto': () => <ControlledPopover mode="auto" />,
    'controlled-manual': () => <ControlledPopover mode="manual" />,
    'default-open': DefaultOpenPopover,
    tooltips: Tooltips,
    combined: Combined,
    identity: Identity,
    unmount: Unmount
}

export type FixtureName = keyof typeof fixtures
