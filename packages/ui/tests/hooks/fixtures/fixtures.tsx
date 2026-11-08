import { usePopover, usePopoverControl, usePopoverOpen, useTooltip } from '@nook/ui/hooks'
import { useEffect, useState } from 'react'

declare global {
    interface Window {
        nookEvents?: string[]
        nookIdentities?: unknown[]
        nookCommits?: number
    }
}

function record(event: string) {
    window.nookEvents ??= []
    window.nookEvents.push(event)
}

function UncontrolledPopover() {
    const [clicks, setClicks] = useState(0)
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
    const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
    const popover = usePopover()
    const open = usePopoverOpen(panel)
    return (
        <main>
            <button
                {...popover.triggerProps}
                ref={setTrigger}
                id="trigger"
                type="button"
                onClick={() => setClicks(clicks + 1)}
            >
                Share
            </button>
            <output id="clicks">{clicks}</output>
            <output id="state">{String(open)}</output>
            <button
                id="show"
                type="button"
                onClick={() =>
                    (
                        panel as (HTMLElement & { showPopover(options?: { source: HTMLElement }): void }) | null
                    )?.showPopover(trigger ? { source: trigger } : undefined)
                }
            >
                showPopover()
            </button>
            <div
                {...popover.contentProps}
                ref={setPanel}
                className="panel"
                onToggle={(event) => {
                    if (event.newState !== event.oldState) record(`popover:${event.newState === 'open'}`)
                }}
            >
                <h2 {...popover.titleProps}>Invite collaborators</h2>
                <button {...popover.closeProps} id="close" type="button">
                    Done
                </button>
            </div>
        </main>
    )
}

function ControlledPopover({
    mode,
    initialOpen = false,
    deferred = false,
    readOnly = false
}: {
    mode: 'auto' | 'manual'
    initialOpen?: boolean
    deferred?: boolean
    readOnly?: boolean
}) {
    const [open, setOpen] = useState(initialOpen)
    const [mounted, setMounted] = useState(!deferred)
    const [version, setVersion] = useState(0)
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
    const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
    const popover = usePopover({ mode })
    const actualOpen = usePopoverOpen(panel)
    usePopoverControl(panel, open, trigger)
    return (
        <main>
            <button {...popover.triggerProps} ref={setTrigger} id="trigger" type="button">
                Status
            </button>
            <button id="external-open" type="button" onClick={() => setOpen(true)}>
                Open from state
            </button>
            <button id="external-close" type="button" onClick={() => setOpen(false)}>
                Close from state
            </button>
            <button id="toggle-content" type="button" onClick={() => setMounted(!mounted)}>
                Toggle content
            </button>
            <button id="rerender" type="button" onClick={() => setVersion(version + 1)}>
                Re-render {version}
            </button>
            <output id="state">{String(actualOpen)}</output>
            <output id="controlled">{String(open)}</output>
            {mounted ? (
                <div
                    {...popover.contentProps}
                    ref={setPanel}
                    className="panel"
                    onToggle={(event) => {
                        record(`controlled:${event.newState === 'open'}`)
                        if (!readOnly) setOpen(event.newState === 'open')
                    }}
                >
                    <h2 {...popover.titleProps}>Status</h2>
                </div>
            ) : null}
        </main>
    )
}

function Tooltips() {
    const described = useTooltip()
    const labelled = useTooltip({ role: 'label' })
    const [element, setElement] = useState<HTMLDivElement | null>(null)
    const open = usePopoverOpen(element)
    return (
        <main>
            <button {...described.triggerProps} id="described" type="button">
                Publish
            </button>
            <div
                {...described.contentProps}
                ref={setElement}
                className="tooltip"
                onToggle={(event) => record(`tooltip:${event.newState === 'open'}`)}
            >
                Visible to everyone in your workspace
            </div>
            <output id="state">{String(open)}</output>
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
    const popover = usePopover()
    const tooltip = useTooltip()
    return (
        <main>
            <button {...popover.triggerProps} {...tooltip.triggerProps} id="trigger" type="button">
                Actions
            </button>
            <div
                {...tooltip.contentProps}
                className="tooltip"
                onToggle={(event) => record(`tooltip:${event.newState === 'open'}`)}
            >
                Project actions
            </div>
            <div
                {...popover.contentProps}
                className="panel"
                onToggle={(event) => record(`popover:${event.newState === 'open'}`)}
            >
                <h2 {...popover.titleProps}>Actions</h2>
            </div>
        </main>
    )
}

function Identity() {
    const [count, setCount] = useState(0)
    const popover = usePopover()
    const tooltip = useTooltip()
    useEffect(() => {
        window.nookIdentities ??= []
        window.nookIdentities.push(popover.triggerProps, popover.contentProps)
        window.nookCommits = (window.nookCommits ?? 0) + 1
    })
    return (
        <main>
            <button id="rerender" type="button" onClick={() => setCount(count + 1)}>
                Re-render {count}
            </button>
            <button {...popover.triggerProps} {...tooltip.triggerProps} id="trigger" type="button">
                Trigger
            </button>
            <div {...popover.contentProps} className="panel" />
            <div {...tooltip.contentProps} className="tooltip">
                Trigger details
            </div>
        </main>
    )
}

function Observation() {
    const [element, setElement] = useState<HTMLDivElement | null>(null)
    const [version, setVersion] = useState(0)
    const [observe, setObserve] = useState(true)
    const open = usePopoverOpen(observe ? element : null)
    return (
        <main>
            <button id="replace" type="button" onClick={() => setVersion(version + 1)}>
                Replace
            </button>
            <button id="observe" type="button" onClick={() => setObserve(!observe)}>
                Observe
            </button>
            <div key={version} id="observed-panel" ref={setElement} popover="manual" className="panel" />
            <output id="state">{String(open)}</output>
        </main>
    )
}

export const fixtures = {
    uncontrolled: UncontrolledPopover,
    'controlled-auto': () => <ControlledPopover mode="auto" />,
    'controlled-manual': () => <ControlledPopover mode="manual" />,
    'controlled-initial': () => <ControlledPopover mode="manual" initialOpen />,
    deferred: () => <ControlledPopover mode="manual" initialOpen deferred />,
    'controlled-readonly': () => <ControlledPopover mode="auto" initialOpen readOnly />,
    tooltips: Tooltips,
    combined: Combined,
    identity: Identity,
    observation: Observation
}
export type FixtureName = keyof typeof fixtures
