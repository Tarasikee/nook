import { Button, Tooltip, TooltipGroup } from '@nook/ui-react'
import { Demo, Icon, useUnsupported, type IconName } from '../shared'

const tools: { icon: IconName; label: string }[] = [
    { icon: 'bold', label: 'Bold' },
    { icon: 'italic', label: 'Italic' },
    { icon: 'link', label: 'Insert link' }
]

export function TooltipDemo() {
    const unsupported = useUnsupported(['popover', 'interest'])

    return (
        <Demo
            title="Tooltip"
            badge="<Tooltip>"
            hint="Hover the toolbar: the first tooltip waits, the next one appears at once (TooltipGroup)."
            unsupported={unsupported}
        >
            <TooltipGroup>
                <div role="toolbar" aria-label="Formatting" style={{ display: 'flex', gap: 4 }}>
                    {tools.map(({ icon, label }) => (
                        <Tooltip key={label} label={label} asLabel>
                            <Button icon variant="ghost">
                                <Icon name={icon} />
                            </Button>
                        </Tooltip>
                    ))}
                </div>
            </TooltipGroup>
            <Tooltip label="Visible to everyone in your workspace">
                <Button variant="primary">Publish</Button>
            </Tooltip>
        </Demo>
    )
}
