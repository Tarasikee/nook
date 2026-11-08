import { Button, TooltipBody, TooltipGroup } from '@nook/ui'
import { useTooltip } from '@nook/ui/hooks'
import { Demo } from '../Demo'
import { Icon, useUnsupported, type IconName } from '../shared'

const tools: { icon: IconName; label: string }[] = [
    { icon: 'bold', label: 'Bold' },
    { icon: 'italic', label: 'Italic' },
    { icon: 'link', label: 'Insert link' }
]

function Tool({ icon, label }: { icon: IconName; label: string }) {
    const tooltip = useTooltip({ role: 'label' })
    return (
        <>
            <Button {...tooltip.triggerProps} icon variant="ghost">
                <Icon name={icon} />
            </Button>
            <TooltipBody {...tooltip.contentProps}>{label}</TooltipBody>
        </>
    )
}

export function TooltipDemo() {
    const unsupported = useUnsupported(['popover', 'interest'])
    const tooltip = useTooltip()
    return (
        <Demo
            title="Tooltip"
            badge="<TooltipBody>"
            hint="Hover the toolbar: the first tooltip waits, the next one appears at once (TooltipGroup)."
            unsupported={unsupported}
        >
            <TooltipGroup role="toolbar" aria-label="Formatting" style={{ display: 'flex', gap: 4 }}>
                {tools.map((tool) => (
                    <Tool key={tool.label} {...tool} />
                ))}
            </TooltipGroup>
            <Button {...tooltip.triggerProps} variant="primary">
                Publish
            </Button>
            <TooltipBody {...tooltip.contentProps}>Visible to everyone in your workspace</TooltipBody>
        </Demo>
    )
}
