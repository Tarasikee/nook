import { Button, Dialog, PopoverBody, TooltipBody, TooltipGroup, type Align, type Side } from '@nook/ui'
import { usePopover, usePopoverControl, useTooltip } from '@nook/ui/hooks'
import { useId, useState } from 'react'

declare global {
    interface Window {
        nookEvents?: string[]
    }
}

function record(event: string) {
    window.nookEvents ??= []
    window.nookEvents.push(event)
}

function Buttons() {
    const [clicks, setClicks] = useState(0)
    return (
        <main>
            <Button variant="primary" onClick={() => setClicks(clicks + 1)}>
                Save
            </Button>
            <Button>Secondary</Button>
            <Button variant="ghost" size="small">
                Ghost
            </Button>
            <Button type="submit" icon aria-label="Send">
                →
            </Button>
            <Button className="min-h-12 px-6" id="custom-button">
                Custom
            </Button>
            <output id="clicks">{clicks}</output>
        </main>
    )
}

function Tooltips() {
    const described = useTooltip()
    const labelled = useTooltip({ role: 'label' })
    const extra = useTooltip()
    return (
        <main>
            <Button {...described.triggerProps} id="publish">
                Publish
            </Button>
            <TooltipBody
                {...described.contentProps}
                onToggle={(event) => record(`tooltip:${event.newState === 'open'}`)}
            >
                Visible to everyone in your workspace
            </TooltipBody>
            <Button {...labelled.triggerProps} id="bold" icon>
                B
            </Button>
            <TooltipBody {...labelled.contentProps}>Bold</TooltipBody>
            <p id="existing-hint">Existing hint</p>
            <Button {...extra.triggerProps} id="merge" aria-describedby={`existing-hint ${extra.contentProps.id}`}>
                Merge
            </Button>
            <TooltipBody {...extra.contentProps}>Extra detail</TooltipBody>
        </main>
    )
}

function Tool({ label }: { label: string }) {
    const tooltip = useTooltip({ role: 'label' })
    return (
        <>
            <Button {...tooltip.triggerProps} icon>
                {label[0]}
            </Button>
            <TooltipBody {...tooltip.contentProps}>{label}</TooltipBody>
        </>
    )
}

function Groups() {
    return (
        <main>
            <TooltipGroup role="toolbar" aria-label="Formatting" style={{ display: 'flex' }}>
                {['Bold', 'Italic', 'Link'].map((label) => (
                    <Tool key={label} label={label} />
                ))}
            </TooltipGroup>
            <div className="solo">
                {['Undo', 'Redo'].map((label) => (
                    <Tool key={label} label={label} />
                ))}
            </div>
        </main>
    )
}

function Popovers() {
    const share = usePopover()
    const above = usePopover()
    return (
        <main>
            <Button {...share.triggerProps} id="share" variant="primary">
                Share
            </Button>
            <PopoverBody {...share.contentProps} onToggle={(event) => record(`popover:${event.newState === 'open'}`)}>
                <h2 {...share.titleProps} className="nook-popover__title m-0 mb-1 text-base font-semibold">
                    Invite collaborators
                </h2>
                <p>Anyone with the link can view.</p>
                <div className="nook-popover__actions mt-4 flex justify-end gap-2">
                    <Button {...share.closeProps} variant="ghost" size="small">
                        Done
                    </Button>
                </div>
            </PopoverBody>
            <div style={{ marginLeft: 400 }}>
                <Button {...above.triggerProps}>Top</Button>
                <PopoverBody {...above.contentProps} side="top" align="end">
                    <h2 {...above.titleProps}>Above</h2>
                    <p>Placed above</p>
                </PopoverBody>
            </div>
        </main>
    )
}

function Combinations() {
    const [clicks, setClicks] = useState(0)
    const actions = usePopover()
    const hint = useTooltip({ role: 'label' })
    return (
        <main>
            <Button {...actions.triggerProps} {...hint.triggerProps} icon onClick={() => setClicks(clicks + 1)}>
                ⋯
            </Button>
            <TooltipBody {...hint.contentProps}>Project actions</TooltipBody>
            <PopoverBody {...actions.contentProps}>
                <h2 {...actions.titleProps}>Actions</h2>
                <p>One button, two behaviors</p>
            </PopoverBody>
            <output id="clicks">{clicks}</output>
        </main>
    )
}

function Controlled() {
    const [open, setOpen] = useState(false)
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
    const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
    const status = usePopover({ mode: 'manual' })
    usePopoverControl(panel, open, trigger)
    return (
        <main>
            <Button {...status.triggerProps} ref={setTrigger}>
                Status
            </Button>
            <PopoverBody
                {...status.contentProps}
                ref={setPanel}
                onToggle={(event) => setOpen(event.newState === 'open')}
            >
                <h2 {...status.titleProps}>Status</h2>
                <p>Live</p>
            </PopoverBody>
            <button id="external-open" type="button" onClick={() => setOpen(true)}>
                Open from state
            </button>
            <output id="state">{String(open)}</output>
        </main>
    )
}

function Dialogs() {
    const id = useId()
    const dismissibleId = useId()
    return (
        <main>
            <Button id="open-dialog" commandfor={id} command="show-modal">
                Delete project
            </Button>
            <Dialog id={id} aria-labelledby={`${id}-title`} onClose={() => record('dialog:close')}>
                <h2 id={`${id}-title`}>Delete project?</h2>
                <p>This cannot be undone.</p>
                <Button id="cancel" commandfor={id} command="close" variant="ghost" size="small">
                    Cancel
                </Button>
            </Dialog>
            <Button id="open-dismissible" commandfor={dismissibleId} command="show-modal">
                Open dismissible
            </Button>
            <Dialog id={dismissibleId} aria-label="Dismissible" closedby="any" className="custom-dialog">
                <Button commandfor={dismissibleId} command="close">
                    Done
                </Button>
            </Dialog>
            <Button id="outside">Outside</Button>
        </main>
    )
}

function Placements() {
    const [side, setSide] = useState<Side>('left')
    const [align, setAlign] = useState<Align>('start')
    const popover = usePopover()
    return (
        <>
            <select id="placement-side" value={side} onChange={(event) => setSide(event.target.value as Side)}>
                <option>left</option>
                <option>right</option>
            </select>
            <select id="placement-align" value={align} onChange={(event) => setAlign(event.target.value as Align)}>
                <option>start</option>
                <option>center</option>
                <option>end</option>
            </select>
            <main style={{ padding: '240px 500px' }}>
                <Button {...popover.triggerProps}>Anchor</Button>
                <PopoverBody {...popover.contentProps} side={side} align={align}>
                    <h2 {...popover.titleProps}>Placement</h2>
                    <p>Anchored content</p>
                </PopoverBody>
            </main>
        </>
    )
}

export const fixtures = {
    placements: Placements,
    buttons: Buttons,
    tooltips: Tooltips,
    groups: Groups,
    popovers: Popovers,
    combinations: Combinations,
    controlled: Controlled,
    dialogs: Dialogs
}
export type FixtureName = keyof typeof fixtures
