import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const cli = fileURLToPath(new URL('../src/index.mjs', import.meta.url))

async function app(t) {
    const cwd = await mkdtemp(join(tmpdir(), 'nook cli '))
    t.after(() => rm(cwd, { recursive: true, force: true }))
    return cwd
}

test('CLI exposes commands and reports invalid input', async () => {
    const { stdout } = await exec(process.execPath, [cli, '--help'])
    assert.match(stdout, /add <components\.\.\.>/)
    assert.match(stdout, /build \[registry\]/)
    await assert.rejects(exec(process.execPath, [cli, 'unknown']), /Unknown command/)
    await assert.rejects(exec(process.execPath, [cli, 'add']), /Specify at least one component/)
    await assert.rejects(exec(process.execPath, [cli, 'add', 'missing-component']), /not in the built registry/)
})

test('build honors the registry project and output directory', async (t) => {
    const cwd = await app(t)
    await writeFile(join(cwd, 'example.tsx'), 'export function Example() { return <button>Example</button> }\n')
    await writeFile(
        join(cwd, 'registry.json'),
        JSON.stringify({
            name: 'test',
            homepage: 'https://example.com',
            items: [{ name: 'example', type: 'registry:ui', files: [{ path: 'example.tsx', type: 'registry:ui' }] }]
        })
    )
    await exec(process.execPath, [cli, 'build', '--cwd', cwd, '--output', 'custom registry'])
    const item = JSON.parse(await readFile(join(cwd, 'custom registry/example.json'), 'utf8'))
    assert.equal(item.name, 'example')
    assert.match(item.files[0].content, /<button>Example<\/button>/)
})

test('add resolves a Nook component outside the repository and honors the app aliases', async (t) => {
    const cwd = await app(t)
    await mkdir(join(cwd, 'src'))
    await writeFile(join(cwd, 'package.json'), JSON.stringify({ name: 'test-app', private: true }))
    await writeFile(
        join(cwd, 'tsconfig.json'),
        JSON.stringify({
            compilerOptions: { baseUrl: '.', paths: { '@/*': ['./src/*'] } }
        })
    )
    await writeFile(join(cwd, 'src/globals.css'), '')
    await writeFile(
        join(cwd, 'components.json'),
        JSON.stringify({
            style: 'new-york',
            rsc: true,
            tsx: true,
            tailwind: { config: '', css: 'src/globals.css', baseColor: 'neutral', cssVariables: true },
            aliases: { components: '@/parts', ui: '@/parts/ui', utils: '@/lib/utils' }
        })
    )

    // Color metadata is fetched by the upstream installer even for utility-only items.
    const server = createServer((request, response) => {
        if (request.url !== '/r/colors/neutral.json') {
            response.writeHead(404).end()
            return
        }
        response.setHeader('Content-Type', 'application/json')
        response.end(
            JSON.stringify({
                inlineColors: { light: {}, dark: {} },
                cssVars: { light: {}, dark: {} },
                inlineColorsTemplate: '',
                cssVarsTemplate: ''
            })
        )
    })
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
    t.after(() => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))))
    const { port } = server.address()
    await exec(process.execPath, [cli, 'add', 'tooltip', '-c', cwd, '-y'], {
        cwd,
        env: { ...process.env, REGISTRY_URL: `http://127.0.0.1:${port}/r` },
        timeout: 20_000
    })
    const installed = await readdir(join(cwd, 'src/parts/ui'))
    assert.ok(installed.includes('Tooltip.tsx'))
    assert.ok(!installed.some((file) => file.endsWith('.css')))
    assert.ok(!installed.includes('Button.tsx'))
    assert.match(await readFile(join(cwd, 'src/parts/ui/Tooltip.tsx'), 'utf8'), /from ['"]\.\/use-tooltip['"]/)
    assert.equal(await readFile(join(cwd, 'src/globals.css'), 'utf8'), '')
})
