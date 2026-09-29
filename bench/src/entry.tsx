import { useEffect, useLayoutEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
// Resolved per library by run.mjs.
import { Item, Provider } from 'bench-lib'

declare global {
    interface Window {
        benchCount: number
        benchStart: number
        benchMounted: number
        benchPainted: number
        benchCommitted: number
        benchRerender: () => void
    }
}

function App() {
    const [tick, setTick] = useState(0)

    // Runs after every child commits: marks the end of mount and of each re-render.
    useLayoutEffect(() => {
        window.benchCommitted = performance.now()
        if (tick === 0) {
            window.benchMounted = window.benchCommitted
            requestAnimationFrame(() => setTimeout(() => (window.benchPainted = performance.now())))
        }
    }, [tick])

    useEffect(() => {
        window.benchRerender = () => setTick((value) => value + 1)
    }, [])

    return (
        <Provider>
            {Array.from({ length: window.benchCount }, (_, index) => (
                <Item key={index} index={index} label={`Item ${index} · ${tick}`} />
            ))}
        </Provider>
    )
}

window.benchStart = performance.now()
createRoot(document.getElementById('root')!).render(<App />)
