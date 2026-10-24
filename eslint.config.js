// Architecture and quality rules from docs/engineering-standards.md, enforced here so that a
// violation fails `npm run lint` instead of waiting for a reviewer.
import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import boundaries from 'eslint-plugin-boundaries'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const restrictSyntax = (message, ...selectors) =>
  selectors.map((selector) => ({ selector, message }))

// Stored HTML is unsanitised on the back end: the front is the only place the XSS hole can be
// closed, by rendering it through RichTextView (DOMPurify) and nowhere else.
const STORED_HTML = 'Stored HTML is rendered only by RichTextView, after DOMPurify.'

// The one thing RichTextView is allowed to use...
const HTML_ATTRIBUTE = restrictSyntax(
  STORED_HTML,
  "JSXAttribute[name.name='dangerouslySetInnerHTML']",
  // ...in any spelling: createElement props, `<div {...{ dangerouslySetInnerHTML }} />`.
  "Property[key.name='dangerouslySetInnerHTML']",
  "Property[key.value='dangerouslySetInnerHTML']",
)

// ...while these sinks stay banned there too.
const HTML_SINKS = restrictSyntax(
  STORED_HTML,
  'AssignmentExpression[left.property.name=/^(innerHTML|outerHTML)$/]',
  'AssignmentExpression[left.property.value=/^(innerHTML|outerHTML)$/]',
  'Property[key.name=/^(innerHTML|outerHTML)$/]',
  'Property[key.value=/^(innerHTML|outerHTML)$/]',
  'CallExpression[callee.property.name=/^(insertAdjacentHTML|setHTMLUnsafe)$/]',
  "CallExpression[callee.object.name='document'][callee.property.name=/^(write|writeln)$/]",
  "JSXAttribute[name.name='srcDoc']",
)

// All user-facing text lives in a strings.ts next to the component (French, tutoiement). Besides
// JSX text, the props that carry text (`aria-label`, `label`, `hint`...) and `{'text'}` children are
// checked; only a literal that contains a letter counts, so `alt=""` stays legal.
const TEXT_PROPS =
  '/^(aria-label|aria-description|alt|title|placeholder|label|hint|error|success|message|description)$/'
const LETTER = '[value=/\\p{L}/u]'
const NO_INLINE_TEXT = restrictSyntax(
  'User-facing text belongs in the strings.ts next to this component.',
  `JSXText${LETTER}`,
  `JSXAttribute[name.name=${TEXT_PROPS}] > Literal${LETTER}`,
  `JSXAttribute[name.name=${TEXT_PROPS}] > JSXExpressionContainer > Literal${LETTER}`,
  `JSXElement > JSXExpressionContainer > Literal${LETTER}`,
  // A sentence built from fragments (`${n} recettes`) is text too, and breaks in another language order.
  `JSXElement > JSXExpressionContainer > TemplateLiteral > TemplateElement[value.raw=/\\p{L}/u]`,
  `JSXAttribute[name.name=${TEXT_PROPS}] > JSXExpressionContainer > TemplateLiteral > TemplateElement[value.raw=/\\p{L}/u]`,
)

const UI_FILES = ['src/components/**/*.tsx', 'src/screens/**/*.tsx', 'src/app/**/*.tsx']
// `*.testkit.tsx` is the shared helper of a screen's tests: part of the tests, never shipped.
const TEST_FILES = ['**/*.test.{ts,tsx}', '**/*.testkit.{ts,tsx}', 'src/test/**']

// Dependencies point one way: screens -> components -> lib. `api` is used by screens and the app
// shell only. See "Architecture rules" in docs/engineering-standards.md.
const ELEMENTS = [
  { type: 'app', pattern: 'src/app' },
  { type: 'screen', pattern: 'src/screens/*', capture: ['screenName'] },
  { type: 'component', pattern: 'src/components/*' },
  { type: 'api', pattern: 'src/api' },
  { type: 'lib', pattern: 'src/lib' },
  { type: 'styles', pattern: 'src/styles' },
  { type: 'test-support', pattern: 'src/test' },
]

const allowImports = (from, ...to) => ({
  from: { element: { type: from } },
  allow: { to: { element: { type: to } } },
})

const BOUNDARY_POLICIES = [
  { allow: { dependency: { relationship: { to: 'internal' } } } },
  allowImports('app', 'screen', 'component', 'api', 'lib'),
  // A screen may import its own folder (internal, above) but never another screen.
  allowImports('screen', 'component', 'api', 'lib', 'app'),
  allowImports('component', 'component', 'lib'),
  allowImports('api', 'lib'),
  // The test setup resets the session between tests.
  allowImports('test-support', 'api'),
  {
    from: { file: { categories: 'test' } },
    allow: { to: { element: { type: 'test-support' } } },
  },
]

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'src/api/schema.d.ts']),

  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat['recommended-latest'],
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      eqeqeq: 'error',
      'no-console': 'error',
      'no-nested-ternary': 'error',
      // `as const` stays allowed; any other assertion is a cast that silences the compiler.
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      // Already errors in strictTypeChecked; spelled out because the project bans them.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      // Numbers in a template literal are safe and everywhere (`0 0 ${width} ${height}`).
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      'no-restricted-syntax': ['error', ...HTML_ATTRIBUTE, ...HTML_SINKS],
    },
  },

  {
    files: ['src/**/*.tsx'],
    extends: [jsxA11y.flatConfigs.strict, reactRefresh.configs.vite],
  },
  {
    // A test helper exports functions and constants beside its components: nothing hot-reloads it.
    files: ['**/*.testkit.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  {
    files: UI_FILES,
    ignores: TEST_FILES,
    rules: {
      'no-restricted-syntax': ['error', ...HTML_ATTRIBUTE, ...HTML_SINKS, ...NO_INLINE_TEXT],
    },
  },

  // The logger wrapper is the one place that writes to the console.
  {
    files: ['src/lib/logger.ts'],
    rules: { 'no-console': 'off' },
  },

  // The one place allowed to render stored HTML, and only through the attribute.
  {
    files: ['src/components/RichTextView/RichTextView.tsx'],
    rules: { 'no-restricted-syntax': ['error', ...HTML_SINKS, ...NO_INLINE_TEXT] },
  },

  // Only api, screens and the app shell talk to the server; everything else gets data as props.
  {
    files: ['src/**/*.{ts,tsx}'],
    // The test support wraps hooks in a query client; it is not shipped.
    ignores: ['src/api/**', 'src/screens/**', 'src/app/**', 'src/test/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@tanstack/react-query', 'openapi-fetch', '**/api/**'],
              message:
                'Only screens and the app shell talk to the API: data and callbacks come in as props.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      // Without the TypeScript extensions the plugin cannot resolve `./Thing` to Thing.tsx and
      // silently skips the import.
      'import/resolver': { node: { extensions: ['.ts', '.tsx', '.js'] } },
      'boundaries/include': ['src/**/*.{ts,tsx}'],
      // main.tsx is the composition root: it mounts <App /> and imports the stylesheet, nothing else.
      'boundaries/ignore': ['src/main.tsx'],
      'boundaries/elements': ELEMENTS,
      'boundaries/files': [{ category: 'test', pattern: TEST_FILES }],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          message: 'Architecture boundary violated (docs/engineering-standards.md).',
          policies: BOUNDARY_POLICIES,
        },
      ],
      // A new top-level folder under src must be classified on purpose.
      'boundaries/no-unknown-files': 'error',
    },
  },
])
