import { useTooltip } from '@nook/react'
import { useState } from 'react'
import { Demo, Icon, useUnsupported, type IconName } from './shared'

type ToolProps = {
    name: string
    icon: IconName
    label: string
    pressed: boolean
    onToggle(): void
}

function Tool({ name, icon, label, pressed, onToggle }: ToolProps) {
    const tooltip = useTooltip({ role: 'label' })

    return (
        <>
            <button
                {...tooltip.triggerProps}
                className="nk-icon-btn"
                type="button"
                aria-pressed={pressed}
                data-testid={`tooltip-trigger-${name}`}
                onClick={onToggle}
            >
                <Icon name={icon} />
            </button>
            <div {...tooltip.contentProps} className="nk-tooltip nk-animated" data-testid={`tooltip-content-${name}`}>
                {label}
            </div>
        </>
    )
}

export function TooltipDemo() {
    const [pressed, setPressed] = useState({ bold: true, italic: false, link: false })
    const unsupported = useUnsupported(['popover', 'interest'])
    const toggle = (key: keyof typeof pressed) => setPressed({ ...pressed, [key]: !pressed[key] })

    return (
        <Demo
            title="Tooltip"
            badge="useTooltip()"
            hint="Hover or Tab to a button. The browser shows each tooltip through interestfor; the delay is the CSS interest-delay. The pressed-state handlers still run."
            unsupported={unsupported}
        >
            <div className="nk-toolbar" role="toolbar" aria-label="Formatting">
                <Tool name="bold" icon="bold" label="Bold" pressed={pressed.bold} onToggle={() => toggle('bold')} />
                <Tool name="italic" icon="italic" label="Italic" pressed={pressed.italic} onToggle={() => toggle('italic')} />
                <Tool name="link" icon="link" label="Insert link" pressed={pressed.link} onToggle={() => toggle('link')} />
            </div>
        </Demo>
    )
}

