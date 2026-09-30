import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BenchResults from './components/BenchResults.vue'
import HomePage from './components/HomePage.vue'
import ReactDemo from './components/ReactDemo.vue'
import SupportMatrix from './components/SupportMatrix.vue'
import '@nook/ui/nook.css'
import './theme.css'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('BenchResults', BenchResults)
        app.component('HomePage', HomePage)
        app.component('ReactDemo', ReactDemo)
        app.component('SupportMatrix', SupportMatrix)

        // A modal dialog makes the page inert, but window key listeners still run: VitePress would
        // open search on `/` or Ctrl/⌘+K underneath the dialog, where it cannot be used.
        if (!import.meta.env.SSR) {
            window.addEventListener(
                'keydown',
                (event) => {
                    const searchKey = event.key === '/' || (event.key === 'k' && (event.metaKey || event.ctrlKey))
                    if (searchKey && document.querySelector('dialog:modal')) {
                        event.stopPropagation()
                    }
                },
                { capture: true }
            )
        }
    }
} satisfies Theme
