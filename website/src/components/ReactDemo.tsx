import { DemoSourceContext } from '../demos/Demo'
import { demos, type DemoName } from '../demos'

export function ReactDemo({ name }: { name: DemoName }) {
    const { Component, source } = demos[name]
    return (
        <div data-demo={name}>
            <DemoSourceContext value={source}>
                <Component />
            </DemoSourceContext>
        </div>
    )
}
