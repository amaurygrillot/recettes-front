// @vitest-environment node
import { resolve } from 'node:path'
import { ESLint } from 'eslint'
import tseslint from 'typescript-eslint'
import { describe, expect, it } from 'vitest'

// The production ESLint configuration, minus type-aware parsing: the snippets below are linted
// from memory (no file on disk), so every rule under test must work without type information.
// This is the proof that the architecture rules actually fire; a plugin upgrade that silently
// stops enforcing one fails here instead of going unnoticed.
const eslint = new ESLint({
  // Config and `src/...` paths resolve from the repository root, whatever the runner's cwd.
  cwd: resolve(import.meta.dirname, '..'),
  overrideConfig: tseslint.configs.disableTypeChecked,
})

async function lint(filePath: string, code: string): Promise<(string | null)[]> {
  const [result] = await eslint.lintText(code, { filePath })
  return (result?.messages ?? []).map((message) => message.ruleId)
}

describe('architecture boundaries', () => {
  it.each([
    ['a component importing the app shell', 'src/components/Thing/Thing.tsx', '../../app/App'],
    ['lib importing the app shell', 'src/lib/thing.ts', '../app/App'],
    ['api importing the app shell', 'src/api/thing.ts', '../app/App'],
    ['lib importing a component', 'src/lib/thing.ts', '../components/Icon/Icon'],
    ['api importing a component', 'src/api/thing.ts', '../components/Icon/Icon'],
    [
      'a component importing a screen',
      'src/components/Thing/Thing.tsx',
      '../../screens/StyleguideScreen/StyleguideScreen',
    ],
    [
      'a screen importing another screen',
      'src/screens/ThingScreen/ThingScreen.tsx',
      '../StyleguideScreen/StyleguideScreen',
    ],
  ])('rejects %s', async (_name, filePath, source) => {
    const ruleIds = await lint(filePath, `import * as used from '${source}'\nexport { used }\n`)

    expect(ruleIds).toContain('boundaries/dependencies')
  })

  it.each([
    ['a screen importing the app shell', 'src/screens/ThingScreen/ThingScreen.ts', '../../app/App'],
    [
      'a screen importing a component',
      'src/screens/ThingScreen/ThingScreen.ts',
      '../../components/Icon/Icon',
    ],
    ['a component importing a component', 'src/components/Thing/Thing.ts', '../Icon/Icon'],
    ['a component importing lib', 'src/components/Thing/Thing.ts', '../../lib/classNames'],
    ['a screen importing its own folder', 'src/screens/StyleguideScreen/Other.ts', './strings'],
  ])('accepts %s', async (_name, filePath, source) => {
    const ruleIds = await lint(filePath, `import * as used from '${source}'\nexport { used }\n`)

    expect(ruleIds).toEqual([])
  })

  it('rejects a file in a folder that is not classified', async () => {
    const ruleIds = await lint('src/misc/thing.ts', 'export const thing = 1\n')

    expect(ruleIds).toContain('boundaries/no-unknown-files')
  })

  it.each([
    ['a component', 'src/components/Thing/Thing.ts', '@tanstack/react-query'],
    ['a component', 'src/components/Thing/Thing.ts', '../../api/client'],
    ['lib', 'src/lib/thing.ts', '@tanstack/react-query'],
    ['lib', 'src/lib/thing.ts', 'openapi-fetch'],
  ])('rejects %s importing %s', async (_name, filePath, source) => {
    const ruleIds = await lint(
      filePath,
      `import { used } from '${source}'\nexport const thing = used\n`,
    )

    expect(ruleIds).toContain('no-restricted-imports')
  })

  it.each([
    ['a screen', 'src/screens/ThingScreen/ThingScreen.ts'],
    ['the app shell', 'src/app/thing.ts'],
    ['api', 'src/api/thing.ts'],
  ])('lets %s import the server libraries', async (_name, filePath) => {
    const ruleIds = await lint(
      filePath,
      "import { useQuery } from '@tanstack/react-query'\nexport const thing = useQuery\n",
    )

    expect(ruleIds).not.toContain('no-restricted-imports')
  })
})

describe('code bans', () => {
  it.each([
    ['console.*', 'src/lib/thing.ts', "console.log('x')\n", 'no-console'],
    [
      'any',
      'src/lib/thing.ts',
      'export const value: any = 1\n',
      '@typescript-eslint/no-explicit-any',
    ],
    [
      'a type assertion',
      'src/lib/thing.ts',
      'export const value = Number(1) as number\n',
      '@typescript-eslint/consistent-type-assertions',
    ],
    [
      'a non-null assertion',
      'src/lib/thing.ts',
      'declare const maybe: string | undefined\nexport const value = maybe!\n',
      '@typescript-eslint/no-non-null-assertion',
    ],
    [
      'a nested ternary',
      'src/lib/thing.ts',
      'export const value = (a: number) => (a > 1 ? 1 : a > 0 ? 2 : 3)\n',
      'no-nested-ternary',
    ],
    [
      'dangerouslySetInnerHTML in a component',
      'src/components/Thing/Thing.tsx',
      'export const Thing = () => <div dangerouslySetInnerHTML={{ __html: "" }} />\n',
      'no-restricted-syntax',
    ],
    [
      'dangerouslySetInnerHTML spread in',
      'src/components/Thing/Thing.tsx',
      'export const Thing = () => <div {...{ dangerouslySetInnerHTML: { __html: "" } }} />\n',
      'no-restricted-syntax',
    ],
    [
      'an innerHTML assignment',
      'src/lib/thing.ts',
      "export const set = (el: HTMLElement) => { el.innerHTML = '' }\n",
      'no-restricted-syntax',
    ],
    [
      'an innerHTML assignment by string key',
      'src/lib/thing.ts',
      "export const set = (el: HTMLElement) => { el['innerHTML'] = '' }\n",
      'no-restricted-syntax',
    ],
    [
      'innerHTML through Object.assign',
      'src/lib/thing.ts',
      "export const set = (el: HTMLElement) => Object.assign(el, { innerHTML: '' })\n",
      'no-restricted-syntax',
    ],
    [
      'insertAdjacentHTML',
      'src/lib/thing.ts',
      "export const add = (el: HTMLElement) => { el.insertAdjacentHTML('beforeend', '') }\n",
      'no-restricted-syntax',
    ],
    [
      'document.write',
      'src/lib/thing.ts',
      "export const add = () => { document.write('') }\n",
      'no-restricted-syntax',
    ],
    [
      'inline French text',
      'src/components/Thing/Thing.tsx',
      'export const Thing = () => <p>Bonjour</p>\n',
      'no-restricted-syntax',
    ],
    [
      'inline French text in an expression',
      'src/screens/ThingScreen/ThingScreen.tsx',
      'export const Thing = () => <p>{"Bonjour"}</p>\n',
      'no-restricted-syntax',
    ],
    [
      'a sentence built in a template literal',
      'src/screens/ThingScreen/ThingScreen.tsx',
      'declare const n: number\nexport const Thing = () => <p>{`${n} recettes`}</p>\n',
      'no-restricted-syntax',
    ],
    [
      'a template literal in a text prop',
      'src/screens/ThingScreen/ThingScreen.tsx',
      'declare const Field: (props: { label: string }) => null\nexport const Thing = () => <Field label={`Titre`} />\n',
      'no-restricted-syntax',
    ],
    [
      'a literal aria-label',
      'src/components/Thing/Thing.tsx',
      'export const Thing = () => <button type="button" aria-label="Fermer" />\n',
      'no-restricted-syntax',
    ],
    [
      'a literal label prop',
      'src/screens/ThingScreen/ThingScreen.tsx',
      'declare const Field: (props: { label: string }) => null\nexport const Thing = () => <Field label="Titre" />\n',
      'no-restricted-syntax',
    ],
    [
      'a literal text prop in an expression',
      'src/screens/ThingScreen/ThingScreen.tsx',
      'declare const Field: (props: { hint: string }) => null\nexport const Thing = () => <Field hint={"Aide"} />\n',
      'no-restricted-syntax',
    ],
    [
      'an image without alternative text',
      'src/components/Thing/Thing.tsx',
      'export const Thing = () => <img src="a.png" />\n',
      'jsx-a11y/alt-text',
    ],
  ])('rejects %s', async (_name, filePath, code, expectedRuleId) => {
    const ruleIds = await lint(filePath, code)

    expect(ruleIds).toContain(expectedRuleId)
  })

  it('lets the logger, and only it, write to the console', async () => {
    const code = "console.log('x')\n"

    expect(await lint('src/lib/logger.ts', code)).toEqual([])
    expect(await lint('src/lib/other.ts', code)).toContain('no-console')
  })

  it('lets RichTextView, and only it, use dangerouslySetInnerHTML', async () => {
    const code = 'export const Thing = () => <div dangerouslySetInnerHTML={{ __html: "" }} />\n'

    expect(await lint('src/components/RichTextView/RichTextView.tsx', code)).toEqual([])
    expect(await lint('src/components/Other/Other.tsx', code)).toContain('no-restricted-syntax')
  })

  it('keeps the other HTML sinks banned inside RichTextView', async () => {
    const ruleIds = await lint(
      'src/components/RichTextView/RichTextView.tsx',
      "export const set = (el: HTMLElement) => { el.innerHTML = '' }\n",
    )

    expect(ruleIds).toContain('no-restricted-syntax')
  })

  it.each([
    ['a decorative image', 'export const Thing = () => <img src="a.png" alt="" />\n'],
    [
      'an empty text prop',
      'declare const Field: (props: { label: string }) => null\nexport const Thing = () => <Field label="" />\n',
    ],
    [
      'a prop without letters',
      'declare const Field: (props: { hint: string }) => null\nexport const Thing = () => <Field hint="42" />\n',
    ],
    [
      'a text taken from strings',
      'declare const strings: { title: string }\nexport const Thing = () => <p>{strings.title}</p>\n',
    ],
  ])('accepts %s', async (_name, code) => {
    const ruleIds = await lint('src/screens/ThingScreen/ThingScreen.tsx', code)

    expect(ruleIds).toEqual([])
  })
})
