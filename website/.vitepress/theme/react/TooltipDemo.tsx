import { useTooltip } from '@nook/react'
import { useState } from 'react'
import { Demo } from './Demo'
import * as kit from './kit.css'
import * as popover from './popover.css'
import { Icon, useUnsupported, type IconName } from './shared'

type ToolProps = {
    icon: IconName
    label: string
    pressed: boolean
    onToggle(): void
}

function Tool({ icon, label, pressed, onToggle }: ToolProps) {
    const tooltip = useTooltip({ role: 'label' })

    return (
        <>
            <button
                {...tooltip.triggerProps}
                className={kit.iconButton}
                type="button"
                aria-pressed={pressed}
                onClick={onToggle}
            >
                <Icon name={icon} />
            </button>
            <div {...tooltip.contentProps} className={`${popover.tooltip} ${popover.animated}`}>
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
            <div className={`${kit.toolbar} ${popover.group}`} role="toolbar" aria-label="Formatting">
                <Tool icon="bold" label="Bold" pressed={pressed.bold} onToggle={() => toggle('bold')} />
                <Tool icon="italic" label="Italic" pressed={pressed.italic} onToggle={() => toggle('italic')} />
                <Tool icon="link" label="Insert link" pressed={pressed.link} onToggle={() => toggle('link')} />
            </div>
        </Demo>
    )
}
