import { hydrateRoot } from 'react-dom/client'
import { App, type PageData } from './App'
import { findPage } from './pages'
import './styles.css'

const data: PageData = JSON.parse(document.getElementById('nook-page')!.textContent!)
const page = findPage(data.path)
const { default: Content } = await page.load()
hydrateRoot(document.getElementById('root')!, <App page={page} Content={Content} data={data} />, {
    identifierPrefix: 'nook-',
    onRecoverableError(error) {
        console.error(error)
    }
})
