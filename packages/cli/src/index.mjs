#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const help = `Usage: nook <command>

Commands:
  add <components...>  Copy Nook components and local helpers into a Tailwind v4 app
  build [registry]     Build shadcn-compatible registry JSON from source files

Add options:
  -c, --cwd <path>     Target app directory (default: current directory)
  -y, --yes            Skip confirmation
  -o, --overwrite      Overwrite existing files
  -a, --all            Add every Nook component
  -p, --path <path>    Override the component destination
  -s, --silent        Mute installer output
      --dry-run       Preview changes without writing files

Build options:
  -c, --cwd <path>     Registry project directory (default: current directory)
  -o, --output <path>  Output directory (default: public/r)

Options:
  -h, --help           Show help
  -v, --version        Show version`

function runShadcn(args) {
    const require = createRequire(import.meta.url)
    const result = spawnSync(process.execPath, [require.resolve('shadcn'), ...args], { stdio: 'inherit' })
    if (result.error) throw result.error
    process.exitCode = result.status ?? 1
}

function add(args) {
    const { values, positionals, tokens } = parseArgs({
        args,
        allowPositionals: true,
        tokens: true,
        options: {
            cwd: { type: 'string', short: 'c' },
            yes: { type: 'boolean', short: 'y' },
            overwrite: { type: 'boolean', short: 'o' },
            all: { type: 'boolean', short: 'a' },
            path: { type: 'string', short: 'p' },
            silent: { type: 'boolean', short: 's' },
            'dry-run': { type: 'boolean' }
        }
    })
    if (!positionals.length && !values.all) throw new Error('Specify at least one component, or use --all.')

    const registryDir = new URL('../dist/r/', import.meta.url)
    const components = values.all
        ? JSON.parse(readFileSync(new URL('registry.json', registryDir), 'utf8')).items.map((item) => item.name)
        : positionals
    const items = components.map((component) => {
        // URLs and file paths remain usable for external registries; bare names select Nook.
        if (!/^[a-z][a-z0-9-]*$/.test(component)) return component
        const file = fileURLToPath(new URL(`${component}.json`, registryDir))
        if (!existsSync(file)) throw new Error(`Nook component "${component}" is not in the built registry.`)
        return file
    })
    const options = tokens
        .filter((token) => token.kind === 'option' && token.name !== 'all')
        .flatMap((token) => [`--${token.name}`, ...(token.value === undefined ? [] : [token.value])])
    runShadcn(['add', ...items, ...options])
}

try {
    const [command, ...args] = process.argv.slice(2)
    if (!command || ['--help', '-h', 'help'].includes(command) || args.includes('--help') || args.includes('-h')) {
        console.log(help)
    } else if (['--version', '-v'].includes(command)) {
        console.log(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version)
    } else if (command === 'add') {
        add(args)
    } else if (command === 'build') {
        runShadcn(['build', ...args])
    } else {
        throw new Error(`Unknown command "${command}". Run nook --help for available commands.`)
    }
} catch (error) {
    console.error(error.message)
    process.exitCode = 1
}
