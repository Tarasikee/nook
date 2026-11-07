import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { fixtures, type FixtureName } from './fixtures'

declare global {
    interface Window {
        nookComponentFixture: FixtureName
        nookComponentHydrated?: boolean
    }
}

const Fixture = fixtures[window.nookComponentFixture]

hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
        <Fixture />
    </StrictMode>
)

window.nookComponentHydrated = true
