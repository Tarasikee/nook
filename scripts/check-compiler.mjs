/**
 * Fails when an exported hook or component is not compiled by React Compiler, unless listed in
 * `exceptions` with a reason. Usage: node scripts/check-compiler.mjs packages/react packages/ui-react
 *
 * Published builds keep `panicThreshold: 'none'`; this check makes skips visible so they can be
 * triaged. Compiler diagnostics can be false positives: fix real Rules of React violations and
 * record justified exceptions here.
 */
import { transformFileAsync } from '@babel/core'
import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

/** `package/Name`: reason, and an upstream issue link if one exists. */
const exceptions = {}

let failed = false

for (const dir of process.argv.slice(2)) {
    const src = resolve(dir, 'src')
    const compiled = new Set()
    const exported = new Set()
    const findings = []

    for (const file of readdirSync(src).filter((name) => /\.tsx?$/.test(name))) {
        const result = await transformFileAsync(join(src, file), {
            configFile: false,
            babelrc: false,
            presets: [
                ['@babel/preset-typescript', { onlyRemoveTypeImports: true }],
                ['@babel/preset-react', { runtime: 'automatic' }]
            ],
            plugins: [
                [
                    'babel-plugin-react-compiler',
                    {
                        target: '19',
                        panicThreshold: 'none',
                        logger: {
                            logEvent(_filename, event) {
                                if (event.kind === 'CompileSuccess') {
                                    compiled.add(event.fnName)
                                } else {
                                    findings.push(
                                        `${file} [${event.kind}] ${JSON.stringify(event.detail ?? event).slice(0, 300)}`
                                    )
                                }
                            }
                        }
                    }
                ]
            ]
        })
        for (const match of result.code.matchAll(/export function ((?:use)?[A-Z]\w*)/g)) {
            exported.add(match[1])
        }
    }

    const skipped = [...exported].filter((name) => !compiled.has(name) && !(`${dir}/${name}` in exceptions))
    console.log(
        `${dir}: compiled ${[...compiled]
            .filter((name) => exported.has(name))
            .sort()
            .join(', ')}`
    )
    for (const finding of findings) console.log(`  triage: ${finding}`)
    if (skipped.length > 0) {
        console.error(`  not compiled: ${skipped.join(', ')}`)
        failed = true
    }
}

process.exit(failed ? 1 : 0)
