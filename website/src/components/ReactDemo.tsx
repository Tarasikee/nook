import { DemoCodeContext } from '../demos/Demo'
import { demos, type DemoName } from '../demos'

export function ReactDemo({ name }: { name: DemoName }) {
    const { Component, code } = demos[name]
    return (
        <div data-demo={name}>
            <DemoCodeContext value={code}>
                <Component />
            </DemoCodeContext>
        </div>
    )
}
