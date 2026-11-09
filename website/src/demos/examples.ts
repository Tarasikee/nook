export const examples = {
    popover: `function SharePopover() {
    const share = usePopover()

    return (
        <>
            <button {...share.triggerProps} type="button">Share</button>
            <div
                {...share.contentProps}
                className="inset-auto m-0 mt-2 rounded-lg border bg-white p-4 [position-area:bottom_span-right]"
            >
                <h2 {...share.titleProps}>Invite collaborators</h2>
                <p>Anyone with this link can view the project.</p>
                <button {...share.closeProps} type="button">Done</button>
            </div>
        </>
    )
}`,
    tooltip: `function FormattingTool({ label, children }: { label: string; children: ReactNode }) {
    const tooltip = useTooltip({ role: 'label' })
    const [pressed, setPressed] = useState(false)

    return (
        <>
            <button
                {...tooltip.triggerProps}
                type="button"
                aria-pressed={pressed}
                onClick={() => setPressed(!pressed)}
            >
                {children}
            </button>
            <div
                {...tooltip.contentProps}
                className="inset-auto m-0 mb-2 rounded bg-slate-900 px-3 py-1.5 text-sm text-white [position-area:top]"
            >
                {label}
            </div>
        </>
    )
}

function FormattingTooltips() {
    return (
        <div
            role="toolbar"
            aria-label="Formatting"
            className="flex gap-2 [&:has(:interest-source)_[interestfor]]:[interest-delay-start:0s]"
        >
            <FormattingTool label="Bold"><strong>B</strong></FormattingTool>
            <FormattingTool label="Italic"><em>I</em></FormattingTool>
        </div>
    )
}`,
    combined: `function ProjectActions() {
    const actions = usePopover()
    const tooltip = useTooltip({ role: 'label' })

    return (
        <>
            <button {...actions.triggerProps} {...tooltip.triggerProps} type="button">⋯</button>
            <div
                {...tooltip.contentProps}
                className="inset-auto m-0 mb-2 rounded bg-slate-900 px-3 py-1.5 text-sm text-white [position-area:top]"
            >
                Project actions
            </div>
            <div
                {...actions.contentProps}
                className="inset-auto m-0 mt-2 rounded-lg border bg-white p-4 [position-area:bottom_span-right]"
            >
                <h2 {...actions.titleProps}>Project actions</h2>
                <p>Manage this project.</p>
                <button {...actions.closeProps} type="button">Done</button>
            </div>
        </>
    )
}`,
    controlled: `function DeploymentStatus() {
    const [open, setOpen] = useState(false)
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
    const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
    const status = usePopover({ mode: 'manual' })

    usePopoverControl(panel, open, trigger)

    return (
        <>
            <button {...status.triggerProps} ref={setTrigger} type="button">Status</button>
            <button type="button" onClick={() => setOpen(true)}>Open status</button>
            <div
                {...status.contentProps}
                ref={setPanel}
                onToggle={(event) => setOpen(event.newState === 'open')}
                className="inset-auto m-0 mt-2 rounded-lg border bg-white p-4 [position-area:bottom_span-right]"
            >
                <h2 {...status.titleProps}>Deployment status</h2>
                <p>Everything is live.</p>
                <button {...status.closeProps} type="button">Dismiss</button>
            </div>
        </>
    )
}`,
    placement: `function PopoverPlacement() {
    const [placement, setPlacement] = useState('bottom')
    const popover = usePopover()

    return (
        <>
            <select aria-label="Placement" value={placement} onChange={(event) => setPlacement(event.target.value)}>
                <option value="top">Top</option>
                <option value="right">Right</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
            </select>
            <button {...popover.triggerProps} type="button">Open</button>
            <div
                {...popover.contentProps}
                className="inset-auto m-2 rounded-lg border bg-white p-4 [position-area:var(--placement)]"
                style={{ '--placement': placement } as CSSProperties}
            >
                <h2 {...popover.titleProps}>Choose a side</h2>
                <p>The browser positions this panel.</p>
            </div>
        </>
    )
}`,
    animation: `function AnimatedPopover() {
    const popover = usePopover()

    return (
        <>
            <button {...popover.triggerProps} type="button">Open</button>
            <div
                {...popover.contentProps}
                className="inset-auto m-0 mt-2 rounded-lg border bg-white p-4 [position-area:bottom_span-right] opacity-0 open:opacity-100 starting:open:opacity-0 transition-[opacity,display,overlay] transition-discrete duration-150 motion-reduce:transition-none"
            >
                <h2 {...popover.titleProps}>Animated popover</h2>
                <p>The browser handles the entry and exit transitions.</p>
                <button {...popover.closeProps} type="button">Close</button>
            </div>
        </>
    )
}`,
    'ui-button': `function ButtonVariants() {
    return (
        <div className="flex flex-wrap gap-2">
            <Button variant="primary">Save changes</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="small">Small</Button>
            <Button icon aria-label="Star project">★</Button>
            <Button disabled>Disabled</Button>
        </div>
    )
}`,
    'ui-dialog': `function DeleteProjectDialog() {
    const id = useId()

    return (
        <>
            <Button commandfor={id} command="show-modal">Delete project</Button>
            <Dialog id={id} aria-labelledby={id + '-title'}>
                <h2 id={id + '-title'}>Delete this project?</h2>
                <p>This removes the project and its history for everyone.</p>
                <Button commandfor={id} command="close" variant="ghost">Cancel</Button>
            </Dialog>
        </>
    )
}`,
    'ui-popover': `function ShareMenu() {
    const share = usePopover()

    return (
        <>
            <Button {...share.triggerProps}>Share</Button>
            <PopoverBody {...share.contentProps}>
                <h2 {...share.titleProps}>Invite collaborators</h2>
                <p>Anyone with this link can view the project.</p>
                <Button {...share.closeProps}>Done</Button>
            </PopoverBody>
        </>
    )
}`,
    'ui-tooltip': `function FormattingToolbar() {
    const bold = useTooltip({ role: 'label' })
    const italic = useTooltip({ role: 'label' })

    return (
        <TooltipGroup role="toolbar" aria-label="Formatting" className="flex gap-1">
            <Button {...bold.triggerProps} icon variant="ghost"><strong>B</strong></Button>
            <TooltipBody {...bold.contentProps}>Bold</TooltipBody>
            <Button {...italic.triggerProps} icon variant="ghost"><em>I</em></Button>
            <TooltipBody {...italic.contentProps}>Italic</TooltipBody>
        </TooltipGroup>
    )
}`,
    publish: `function PublishButton() {
    const tooltip = useTooltip()

    return (
        <>
            <Button {...tooltip.triggerProps}>Publish</Button>
            <TooltipBody {...tooltip.contentProps}>Visible to everyone in your workspace</TooltipBody>
        </>
    )
}`,
    'ui-combined': `function ProjectActions() {
    const popover = usePopover()
    const tooltip = useTooltip()

    return (
        <>
            <Button {...popover.triggerProps} {...tooltip.triggerProps}>Actions</Button>
            <TooltipBody {...tooltip.contentProps}>Available actions</TooltipBody>
            <PopoverBody {...popover.contentProps}>
                <h2 {...popover.titleProps}>Actions</h2>
                <Button {...popover.closeProps}>Done</Button>
            </PopoverBody>
        </>
    )
}`,
    observed: `function PopoverStatus() {
    const popover = usePopover()
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
    const open = usePopoverOpen(panel)

    return (
        <>
            <Button {...popover.triggerProps}>Details</Button>
            <output>{open ? 'Open' : 'Closed'}</output>
            <PopoverBody {...popover.contentProps} ref={setPanel}>
                <h2 {...popover.titleProps}>Details</h2>
                <Button {...popover.closeProps}>Done</Button>
            </PopoverBody>
        </>
    )
}`,
    'dialog-state': `function DialogStatus() {
    const id = useId()
    const [dialog, setDialog] = useState<HTMLDialogElement | null>(null)
    const open = useSyncExternalStore(
        (notify) => {
            if (!dialog) return () => {}
            const observer = new MutationObserver(notify)
            observer.observe(dialog, { attributeFilter: ['open'] })
            return () => observer.disconnect()
        },
        () => dialog?.open ?? false,
        () => false
    )

    return (
        <>
            <Button commandfor={id} command="show-modal">Open dialog</Button>
            <output>{open ? 'Open' : 'Closed'}</output>
            <Dialog id={id} ref={setDialog} aria-labelledby={id + '-title'}>
                <h2 id={id + '-title'}>Project details</h2>
                <Button commandfor={id} command="close">Close</Button>
            </Dialog>
        </>
    )
}`,
    imperative: `function StatusPanel() {
    const status = usePopover()
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
    const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)

    function showStatus() {
        if (!panel || !trigger) return
        const popover = panel as HTMLDivElement & {
            showPopover(options: { source: HTMLElement }): void
        }
        popover.showPopover({ source: trigger })
    }

    return (
        <>
            <Button ref={setTrigger} onClick={showStatus}>
                Show status
            </Button>
            <PopoverBody {...status.contentProps} ref={setPanel}>
                <h2 {...status.titleProps}>Status</h2>
                <p>Everything is live.</p>
                <Button {...status.closeProps}>Dismiss</Button>
            </PopoverBody>
        </>
    )
}`
}
