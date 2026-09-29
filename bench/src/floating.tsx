import {
    autoUpdate,
    flip,
    FloatingPortal,
    offset,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useMergeRefs,
    useRole
} from '@floating-ui/react'
import { useState, type ReactNode } from 'react'

export type ItemProps = { index: number; label: string }

export function Item({ index, label }: ItemProps) {
    const [tipOpen, setTipOpen] = useState(false)
    const [panelOpen, setPanelOpen] = useState(false)

    const tip = useFloating({
        open: tipOpen,
        onOpenChange: setTipOpen,
        placement: 'top',
        whileElementsMounted: autoUpdate,
        middleware: [offset(8), flip(), shift()]
    })
    const panel = useFloating({
        open: panelOpen,
        onOpenChange: setPanelOpen,
        placement: 'bottom-start',
        whileElementsMounted: autoUpdate,
        middleware: [offset(8), flip(), shift()]
    })

    const tipInteractions = useInteractions([
        useHover(tip.context),
        useFocus(tip.context),
        useDismiss(tip.context),
        useRole(tip.context, { role: 'tooltip' })
    ])
    const panelInteractions = useInteractions([
        useClick(panel.context),
        useDismiss(panel.context),
        useRole(panel.context)
    ])
    // Setters are destructured before render use: reading `refs.*` inline makes React Compiler
    // skip this component ("Cannot access refs during render"), which would leave Floating UI
    // as the only uncompiled item in the benchmark.
    const { setReference: setTipReference, setFloating: setTipFloating } = tip.refs
    const { setReference: setPanelReference, setFloating: setPanelFloating } = panel.refs
    const ref = useMergeRefs([setTipReference, setPanelReference])

    return (
        <div className="item">
            <button
                ref={ref}
                className="trigger"
                {...tipInteractions.getReferenceProps(panelInteractions.getReferenceProps())}
            >
                {label}
            </button>
            {tipOpen ? (
                <FloatingPortal>
                    <div
                        ref={setTipFloating}
                        style={tip.floatingStyles}
                        className="tip"
                        {...tipInteractions.getFloatingProps()}
                    >
                        Tooltip {index}
                    </div>
                </FloatingPortal>
            ) : null}
            {panelOpen ? (
                <FloatingPortal>
                    <div
                        ref={setPanelFloating}
                        style={panel.floatingStyles}
                        className="panel"
                        {...panelInteractions.getFloatingProps()}
                    >
                        <h3>Panel {index}</h3>
                        <p>Content</p>
                    </div>
                </FloatingPortal>
            ) : null}
        </div>
    )
}

export function Provider({ children }: { children: ReactNode }) {
    return <>{children}</>
}
