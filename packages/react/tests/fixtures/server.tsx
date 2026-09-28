import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { type FixtureName, fixtures } from './fixtures'

export function render(name: FixtureName): string {
    const Fixture = fixtures[name]
    return renderToString(
        <StrictMode>
            <Fixture />
        </StrictMode>
    )
}
