import nookButtonStyles from '@nook/ui/button.css?source'
import nookDialogStyles from '@nook/ui/dialog.css?source'
import nookPopoverStyles from '@nook/ui/popover.css?source'
import nookTooltipStyles from '@nook/ui/tooltip.css?source'
import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimationDemo } from './AnimationDemo'
import animationCode from './AnimationDemo?source'
import { CombinedDemo } from './CombinedDemo'
import combinedCode from './CombinedDemo?source'
import { ControlledDemo } from './ControlledDemo'
import controlledCode from './ControlledDemo?source'
import { DemoSourceContext, type Source } from './Demo'
import { HeroDemo } from './HeroDemo'
import { PlacementDemo } from './PlacementDemo'
import placementStyles from './PlacementDemo.css?source'
import placementCode from './PlacementDemo?source'
import popoverStyles from './popover.css?source'
import { PopoverDemo } from './PopoverDemo'
import popoverCode from './PopoverDemo?source'
import { TooltipDemo } from './TooltipDemo'
import tooltipCode from './TooltipDemo?source'
import { ButtonDemo as UiButtonDemo } from './ui/ButtonDemo'
import uiButtonCode from './ui/ButtonDemo?source'
import { DialogDemo as UiDialogDemo } from './ui/DialogDemo'
import uiDialogCode from './ui/DialogDemo?source'
import { PopoverDemo as UiPopoverDemo } from './ui/PopoverDemo'
import uiPopoverCode from './ui/PopoverDemo?source'
import { TooltipDemo as UiTooltipDemo } from './ui/TooltipDemo'
import uiTooltipCode from './ui/TooltipDemo?source'

type Entry = { component: ComponentType; code?: Source; styles?: Source }

/**
 * Each demo with the exact files that run it: the component in the Code tab, and in the CSS tab
 * the styles it demonstrates (popover.css.ts unless the demo has its own).
 */
export const demos = {
    animation: { component: AnimationDemo, code: animationCode },
    combined: { component: CombinedDemo, code: combinedCode },
    controlled: { component: ControlledDemo, code: controlledCode },
    hero: { component: HeroDemo },
    placement: { component: PlacementDemo, code: placementCode, styles: placementStyles },
    popover: { component: PopoverDemo, code: popoverCode },
    tooltip: { component: TooltipDemo, code: tooltipCode },
    'ui-button': { component: UiButtonDemo, code: uiButtonCode, styles: nookButtonStyles },
    'ui-dialog': { component: UiDialogDemo, code: uiDialogCode, styles: nookDialogStyles },
    'ui-popover': { component: UiPopoverDemo, code: uiPopoverCode, styles: nookPopoverStyles },
    'ui-tooltip': { component: UiTooltipDemo, code: uiTooltipCode, styles: nookTooltipStyles }
} satisfies Record<string, Entry>

export type DemoName = keyof typeof demos

/** Mounts a demo into a host element in StrictMode. Returns an unmount function. */
export function mountDemo(host: HTMLElement, name: DemoName): () => void {
    const { component: Component, code, styles = popoverStyles } = demos[name] as Entry
    const root = createRoot(host)
    root.render(
        <StrictMode>
            <DemoSourceContext value={code ? { code, styles } : null}>
                <Component />
            </DemoSourceContext>
        </StrictMode>
    )
    return () => root.unmount()
}
