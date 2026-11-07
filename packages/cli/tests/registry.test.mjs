import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { build } from 'esbuild'
import { compile } from '@tailwindcss/node'
import { Scanner } from '@tailwindcss/oxide'
import { registryItemSchema, registrySchema } from 'shadcn/schema'
import ts from 'typescript'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const registry = registrySchema.parse(
    JSON.parse(await readFile(new URL('../../../registry.json', import.meta.url), 'utf8'))
)
const cache = join(root, 'node_modules/.cache')
await mkdir(cache, { recursive: true })

test('registry exposes the four native components', () => {
    assert.deepEqual(registry.items.map((item) => item.name).sort(), ['button', 'dialog', 'popover', 'tooltip'])
})

for (const source of registry.items) {
    test(`${source.name} downloads and compiles without any Nook packages`, async (t) => {
        const item = registryItemSchema.parse(
            JSON.parse(await readFile(join(root, `packages/cli/dist/r/${source.name}.json`), 'utf8'))
        )
        const app = await mkdtemp(join(cache, 'nook-registry-'))
        t.after(() => rm(app, { recursive: true, force: true }))
        const ui = join(app, 'src/custom/ui')
        await mkdir(ui, { recursive: true })
        assert.ok(item.files?.length)

        for (const file of item.files) {
            assert.ok(!file.path.endsWith('.css'), 'Component downloads must use Tailwind classes without CSS files.')
            assert.match(file.target, /^@ui\/[^/]+$/)
            assert.equal(file.content, await readFile(join(root, file.path), 'utf8'))
            await writeFile(join(ui, file.target.slice('@ui/'.length)), file.content)

            const imports = ts.preProcessFile(file.content).importedFiles.map((imported) => imported.fileName)
            assert.ok(!imports.some((name) => name.endsWith('.css')))
            for (const imported of imports.filter((name) => !name.startsWith('.'))) {
                const dependency = imported
                    .split('/')
                    .slice(0, imported.startsWith('@') ? 2 : 1)
                    .join('/')
                assert.ok(
                    dependency === 'react' || item.dependencies?.some((name) => name.startsWith(`${dependency}@`)),
                    `${file.path} imports undeclared dependency ${imported}`
                )
            }
        }

        const component = item.files.find((file) => file.path.endsWith('.tsx'))
        assert.ok(component)
        assert.ok(component.content.startsWith("'use client'"))
        const entry = join(ui, basename(component.target))
        const result = await build({
            absWorkingDir: root,
            entryPoints: [entry],
            bundle: true,
            write: false,
            outdir: join(app, 'dist'),
            jsx: 'automatic',
            metafile: true,
            logLevel: 'silent'
        })
        const tailwind = await compile('@import "tailwindcss" source(none);', { base: app, onDependency() {} })
        const scanner = new Scanner({ sources: [{ base: ui, pattern: '**/*.{ts,tsx}', negated: false }] })
        const css = tailwind.build(scanner.scan())
        assert.match(css, /font-family: var\(--font-sans\)/)
        if (source.name !== 'button') {
            assert.match(css, /@starting-style/)
            assert.match(css, /transition-behavior: allow-discrete/)
        }
        if (source.name === 'tooltip' || source.name === 'popover') {
            assert.match(css, /position-area: block-start var\(--nook-align\)/)
            assert.match(css, /:popover-open/)
        }
        for (const input of Object.keys(result.metafile.inputs)) {
            const path = resolve(root, input)
            assert.ok(
                path.startsWith(app) || path.startsWith(join(root, 'node_modules')),
                `Leaked workspace source: ${input}`
            )
        }
        await writeFile(
            join(app, 'tsconfig.json'),
            JSON.stringify({
                compilerOptions: {
                    strict: true,
                    noEmit: true,
                    skipLibCheck: true,
                    target: 'ESNext',
                    module: 'ESNext',
                    moduleResolution: 'bundler',
                    jsx: 'react-jsx',
                    types: ['react']
                },
                include: ['src']
            })
        )
        execFileSync(
            process.execPath,
            [join(root, 'node_modules/typescript/bin/tsc'), '--project', join(app, 'tsconfig.json')],
            {
                cwd: dirname(entry),
                stdio: 'pipe'
            }
        )
    })
}
