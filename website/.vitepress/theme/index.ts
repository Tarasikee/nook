import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BenchResults from './components/BenchResults.vue'
import HomePage from './components/HomePage.vue'
import ReactDemo from './components/ReactDemo.vue'
import SupportMatrix from './components/SupportMatrix.vue'
import './custom.css'
import './demo.css'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('BenchResults', BenchResults)
        app.component('HomePage', HomePage)
        app.component('ReactDemo', ReactDemo)
        app.component('SupportMatrix', SupportMatrix)
    }
} satisfies Theme
