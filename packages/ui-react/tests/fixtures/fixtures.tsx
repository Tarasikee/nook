import { Button, Popover, PopoverClose, Tooltip, TooltipGroup } from '@nook/ui-react'
import { useState } from 'react'

declare global {
    interface Window {
        nookEvents?: string[]
    }
}

function record(event: string) {
    if (typeof window !== 'undefined') {
        window.nookEvents ??= []
        window.nookEvents.push(event)
    }
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
            <output id="clicks">{clicks}</output>
        </main>
    )
}

function Tooltips() {
    return (
        <main>
            <Tooltip label="Visible to everyone in your workspace" onOpenChange={(open) => record(`tooltip:${open}`)}>
                <Button id="publish">Publish</Button>
            </Tooltip>
            <Tooltip label="Bold" asLabel>
                <Button id="bold" icon>
                    B
                </Button>
            </Tooltip>
            <p id="existing-hint">Existing hint</p>
            <Tooltip label="Extra detail">
                <Button id="merge" aria-describedby="existing-hint">
                    Merge
                </Button>
            </Tooltip>
        </main>
    )
}

function Groups() {
    return (
        <main>
            <TooltipGroup>
                {['Bold', 'Italic', 'Link'].map((label) => (
                    <Tooltip key={label} label={label} asLabel>
                        <Button icon>{label[0]}</Button>
                    </Tooltip>
                ))}
            </TooltipGroup>
            <div className="solo">
                {['Undo', 'Redo'].map((label) => (
                    <Tooltip key={label} label={label} asLabel>
                        <Button icon>{label[0]}</Button>
                    </Tooltip>
                ))}
            </div>
        </main>
    )
}

function Popovers() {
    return (
        <main>
            <Popover
                title="Invite collaborators"
                onOpenChange={(open) => record(`popover:${open}`)}
                content={
                    <>
                        <p>Anyone with the link can view.</p>
                        <div className="nook-popover__actions">
                            <PopoverClose>Done</PopoverClose>
                        </div>
                    </>
                }
            >
                <Button id="share" variant="primary">
                    Share
                </Button>
            </Popover>
            {/* Room on the left, so align="end" needs no fallback flip. */}
            <div style={{ marginLeft: 400 }}>
                <Popover title="Above" side="top" align="end" content={<p>Placed above</p>}>
                    <Button>Top</Button>
                </Popover>
            </div>
        </main>
    )
}

function Combinations() {
    const [clicks, setClicks] = useState(0)
    return (
        <main>
            <Tooltip label="Project actions" asLabel>
                <Popover title="Actions" content={<p>Tooltip outside</p>}>
                    <Button icon onClick={() => setClicks(clicks + 1)}>
                        ⋯
                    </Button>
                </Popover>
            </Tooltip>
            <Popover title="More" content={<p>Popover outside</p>}>
                <Tooltip label="More options" asLabel>
                    <Button icon>⋮</Button>
                </Tooltip>
            </Popover>
            <output id="clicks">{clicks}</output>
        </main>
    )
}

function Controlled() {
    const [open, setOpen] = useState(false)
    return (
        <main>
            <Popover title="Status" mode="manual" open={open} onOpenChange={setOpen} content={<p>Live</p>}>
                <Button>Status</Button>
            </Popover>
            <button id="external-open" type="button" onClick={() => setOpen(true)}>
                Open from state
            </button>
            <output id="state">{String(open)}</output>
        </main>
    )
}

export const fixtures = {
    buttons: Buttons,
    tooltips: Tooltips,
    groups: Groups,
    popovers: Popovers,
    combinations: Combinations,
    controlled: Controlled
}

export type FixtureName = keyof typeof fixtures
