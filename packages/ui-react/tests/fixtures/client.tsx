import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { fixtures, type FixtureName } from './fixtures'

declare global {
    interface Window {
        nookFixture: FixtureName
        nookHydrated?: boolean
    }
}

const Fixture = fixtures[window.nookFixture]

hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
        <Fixture />
    </StrictMode>
)

window.nookHydrated = true
