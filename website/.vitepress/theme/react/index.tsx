import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import behaviorCss from '../demo.css?source=behavior'
import { AnimationDemo } from './AnimationDemo'
import animationSource from './AnimationDemo.tsx?source'
import { CombinedDemo } from './CombinedDemo'
import combinedSource from './CombinedDemo.tsx?source'
import { ControlledDemo } from './ControlledDemo'
import controlledSource from './ControlledDemo.tsx?source'
import { HeroDemo } from './HeroDemo'
import { PlacementDemo } from './PlacementDemo'
import placementSource from './PlacementDemo.tsx?source'
import { PopoverDemo } from './PopoverDemo'
import popoverSource from './PopoverDemo.tsx?source'
import { DemoSourceContext } from './shared'
import { TooltipDemo } from './TooltipDemo'
import tooltipSource from './TooltipDemo.tsx?source'

type Entry = { component: ComponentType; source?: string }

/** Each demo with the exact source file that runs it, shown in the demo's Code tab. */
export const demos = {
    animation: { component: AnimationDemo, source: animationSource },
    combined: { component: CombinedDemo, source: combinedSource },
    controlled: { component: ControlledDemo, source: controlledSource },
    hero: { component: HeroDemo },
    placement: { component: PlacementDemo, source: placementSource },
    popover: { component: PopoverDemo, source: popoverSource },
    tooltip: { component: TooltipDemo, source: tooltipSource }
} satisfies Record<string, Entry>

export type DemoName = keyof typeof demos

/** Mounts a demo into a host element in StrictMode. Returns an unmount function. */
export function mountDemo(host: HTMLElement, name: DemoName): () => void {
    const { component: Component, source } = demos[name] as Entry
    const root = createRoot(host)
    root.render(
        <StrictMode>
            <DemoSourceContext value={source ? { tsx: source, css: behaviorCss } : null}>
                <Component />
            </DemoSourceContext>
        </StrictMode>
    )
    return () => root.unmount()
}
