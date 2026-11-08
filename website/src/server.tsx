import { renderToStaticMarkup } from 'react-dom/server'
import { prerenderToNodeStream } from 'react-dom/static'
import { codeToHtml } from 'shiki'
import { App, type Heading, type PageData } from './App'
import { findPage, pages, type PageDefinition } from './pages'

type Assets = { script: string; styles: string[]; siteUrl: string }
export { pages } from './pages'

function escape(value: string): string {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function text(html: string): string {
    return html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, value: string) =>
            String.fromCodePoint(value.startsWith('x') ? parseInt(value.slice(1), 16) : Number(value))
        )
        .replaceAll('&quot;', '"')
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&#x27;', "'")
        .replace(/\s+/g, ' ')
        .trim()
}

async function inspect(page: PageDefinition) {
    const { default: Content } = await page.load()
    // This first render supplies build metadata only; the final page uses React's hydratable prerender API.
    const preview = renderToStaticMarkup(<Content />)
    const outline: Heading[] = []
    for (const match of preview.matchAll(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/g)) {
        const id = /\bid="([a-z0-9-]+)"/.exec(match[2])?.[1]
        if (id) outline.push({ id, text: text(match[3]), level: Number(match[1]) })
    }
    const entry = { path: page.path, title: page.title, description: page.description, text: text(preview) }
    return { Content, preview, outline, entry }
}

export async function searchIndex() {
    return Promise.all(pages.map(async (page) => (await inspect(page)).entry))
}

export async function renderPage(path: string, assets: Assets) {
    const page = findPage(path)
    const { Content, preview, outline, entry } = await inspect(page)
    const highlights: Record<string, string> = {}
    await Promise.all(
        [...preview.matchAll(/data-source="([^"]+)"/g)].map(async ([, attribute]) => {
            const key = text(attribute)
            const [language, source] = JSON.parse(decodeURIComponent(key)) as [string, string]
            highlights[key] = await codeToHtml(source, {
                lang: language,
                themes: { light: 'github-light', dark: 'github-dark' },
                defaultColor: false
            })
        })
    )
    const data: PageData = { path: page.path, outline, highlights }
    const { prelude } = await prerenderToNodeStream(<App page={page} Content={Content} data={data} />, {
        identifierPrefix: 'nook-'
    })
    let body = ''
    for await (const chunk of prelude) body += chunk
    const title = page.path === '/' ? 'Nook — Native HTML. Components you own.' : `${page.title} · Nook`
    const json = JSON.stringify(data).replaceAll('<', '\\u003c')
    const theme = `try{document.documentElement.classList.toggle('dark',(localStorage.getItem('nook-theme')??(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))==='dark')}catch{}`
    const status = page.path === '/404' ? 404 : 200
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(page.description)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:type" content="website"><meta name="theme-color" content="#047857"><link rel="icon" type="image/svg+xml" href="/logo.svg">${status === 404 ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${escape(new URL(page.path, assets.siteUrl).href)}">`}${assets.styles.map((href) => `<link rel="stylesheet" href="${href}">`).join('')}<script>${theme}</script></head><body><div id="root">${body}</div><script id="nook-page" type="application/json">${json}</script><script type="module" src="${assets.script}"></script></body></html>`
    return { html, status, entry }
}
