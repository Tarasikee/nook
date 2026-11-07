import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { type FixtureName, fixtures } from './fixtures'

declare global {
    interface Window {
        nookHookFixture: FixtureName
        nookHookHydrated?: boolean
    }
}

const Fixture = fixtures[window.nookHookFixture]

hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
        <Fixture />
    </StrictMode>
)

window.nookHookHydrated = true
