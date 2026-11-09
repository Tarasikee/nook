import { expect, test } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { examples } from '../src/demos/examples'

test('standalone implementations typecheck with only React and public Nook APIs', () => {
    const imports = `
        import { useId, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
        import { Button, Dialog, PopoverBody, TooltipBody, TooltipGroup } from '../../../packages/ui/src'
        import { usePopover, usePopoverControl, usePopoverOpen, useTooltip } from '../../../packages/ui/src/hooks'
    `
    const sources = new Map(
        Object.entries(examples).map(([name, code]) => [
            fileURLToPath(new URL(`../src/demos/example-${name}.tsx`, import.meta.url)),
            imports + code
        ])
    )
    const options: ts.CompilerOptions = {
        noEmit: true,
        strict: true,
        skipLibCheck: true,
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        jsx: ts.JsxEmit.ReactJSX
    }
    const host = ts.createCompilerHost(options)
    const getSourceFile = host.getSourceFile
    host.getSourceFile = (path, languageVersion, onError, shouldCreateNewSourceFile) => {
        const code = sources.get(path)
        return code === undefined
            ? getSourceFile(path, languageVersion, onError, shouldCreateNewSourceFile)
            : ts.createSourceFile(path, code, languageVersion, true)
    }
    const program = ts.createProgram([...sources.keys()], options, host)
    expect(
        ts.getPreEmitDiagnostics(program).map((diagnostic) => ({
            file: diagnostic.file?.fileName,
            message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
        }))
    ).toEqual([])
})

test('every demo code tab contains an implementation without imports or private helpers', async ({ page }) => {
    for (const path of ['/examples/', '/ui/button', '/ui/dialog', '/ui/popover', '/ui/tooltip']) {
        await page.goto(path)
        const demos = page.getByRole('figure').filter({ has: page.getByRole('tab', { name: 'Code', exact: true }) })
        expect(await demos.count()).toBeGreaterThan(0)
        for (const demo of await demos.all()) {
            await demo.getByRole('tab', { name: 'Code', exact: true }).click()
            const implementation = await demo
                .getByRole('tabpanel', { name: 'Code', exact: true })
                .locator('pre code')
                .textContent()
            expect(implementation).toMatch(/^function \w+\(/)
            expect(implementation).not.toMatch(/\bimport\b|<Demo\b|kit\.|useUnsupported|<Icon\b/)
        }
    }
})
