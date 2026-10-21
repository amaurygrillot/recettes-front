# Engineering standards

The bar for every change in this repository. The goal is a code base that is top of the art: small, readable,
consistent, and structured so that a new feature is a new folder, not a change in ten places. These standards apply to
people and agents alike, and an agent working alone is expected to hold itself to them without being asked.

The numbers below are guidelines that trigger a conscious look (« should this be split? »), not mechanical rules. Break
one only with a reason you could state in a code review.

## Principles

**DRY, KISS, SRP**, as in the user's global guidance, applied to React and TypeScript:

- **SRP.** A component has one reason to change. A component renders; a custom hook owns a behaviour; a function in `lib`
  does one transformation. If a file needs « and » to be described, split it.
- **KISS.** The simplest thing that is correct. No abstraction for a single use. **Wait for the third repetition** before
  extracting a shared component or hook; two similar blocks are not yet a pattern. Extract earlier only when the
  duplicated thing is a business rule (a limit, a status mapping) that must never drift.
- **DRY.** One place per rule: API types come from the contract, design values from the theme tokens, French text from
  `strings.ts`, error-status messages from one mapper, HTML sanitising from one component.
- **Composition over configuration.** Prefer small components that take `children` or slots to one component with a dozen
  boolean props. More than about seven props is a sign the component does two jobs.

## Architecture rules (enforced by lint)

Dependencies point one way: **`screens` → `components` → `lib`**, and `api` is used by `screens` (and `app`) only.

| From | May import | Must not import |
|---|---|---|
| `src/screens/X` | `components`, `api`, `lib`, `app` utilities, its own folder | another screen |
| `src/components/*` | `lib`, other `components` | `screens`, `api`, `app` |
| `src/api` | `lib`, generated schema | `screens`, `components`, React UI |
| `src/lib` | nothing of the app | everything else |

- Components are presentational: data and callbacks come in as props. Only screens (and the `app` shell) talk to the API.
- A screen never imports from another screen. Shared code moves to `components` or `lib` instead.
- `dangerouslySetInnerHTML` appears only inside `RichTextView`, after DOMPurify.
- `console.*` is forbidden; use the logger from `lib`.
- These rules are encoded in the ESLint configuration (an import-boundaries plugin or `no-restricted-imports` patterns),
  so a violation fails `npm run lint` instead of waiting for a reviewer.

## TypeScript

- `strict` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `verbatimModuleSyntax`.
  Turn one off only for a documented, local reason.
- **No `any`, no `as` casts to silence the compiler, no non-null `!`.** Narrow with checks, type guards or
  discriminated unions. A cast at an unavoidable boundary (the generated client, a DOM API) is isolated in one function
  with a comment.
- Model states as **discriminated unions** (`{ status: 'loading' } | { status: 'error', … } | { status: 'ready', data }`)
  rather than several booleans that can contradict each other.
- API shapes are the generated types; do not redeclare them. A view model that differs from the API shape is built by a
  small, tested function.
- Export the minimum. Types for props live next to the component. No barrel files that re-export whole folders.
- Names say what a thing is: `RecipeSummary`, not `Data`; `isSessionExpired`, not `flag`.

## React

- Function components and hooks only. One component per file, named like the file.
- **Derive, do not synchronise.** Anything computable from props or state is computed during render, never copied into
  state through an effect.
- `useEffect` is for synchronising with something outside React (a DOM API, a subscription, the wake lock). It is not for
  fetching (TanStack Query) and not for reacting to a user event (use the event handler).
- Server state lives in TanStack Query; UI state stays as local as it can. Context only for genuinely cross-cutting state
  (the authenticated session). No global store unless a decision record justifies one.
- Put logic in **custom hooks** (`useRecipeSearch`, `useDraft`) so components read as layout and wiring. A component body
  that is mostly `if`s and `useEffect`s needs a hook extracted.
- Do not memoise by habit. `memo`, `useMemo` and `useCallback` appear when a measured problem or a stable-identity
  requirement exists, with a comment saying which.
- Lists have stable `key`s that are ids, never indexes of reorderable data.
- Each route has an error boundary (`errorElement`) so one failing screen cannot blank the app.
- Forms use React Hook Form; every field has a visible label and an accessible error message.

## Size and shape (guidelines)

- A component file: about 150 lines. A function: about 30. A custom hook: about 80. Over that, ask whether it has one job.
- Nesting deeper than three levels in JSX or in a function is a reason to extract a component or return early.
- Prefer early returns to nested conditionals. No nested ternaries.
- Comments explain **why**, never what. If a comment restates the next line, rename something instead.

## Naming and files

- Components, their files and their folders: `PascalCase`. Hooks: `useThing`. Everything else: `camelCase`. Constants that
  are truly constant: `SCREAMING_SNAKE_CASE`.
- A component folder contains `Thing.tsx`, `Thing.test.tsx`, and `strings.ts` if it has text. Nothing else by default.
- French text only in `strings.ts`, tutoiement, never concatenated from fragments that break in another sentence order.

## Logging

Use the logger wrapper from `lib` for key steps of a flow (entering a protected route, login and logout, failed calls,
session expiry, uploads, draft restore). Levels: `debug` / `info` for normal flow, `warn` / `error` for failures. Never log
tokens, passwords, e-mail addresses or recipe content. No `console.*`.

## Accessibility

Semantic elements first (`button`, `a`, `label`, `nav`, `main`), ARIA only to fill a real gap. Visible focus on everything
interactive, keyboard operable, icon-only buttons have an accessible name, color is never the only signal, contrast as in
the design tokens. Component tests include an automated accessibility assertion through a small shared helper built on
`axe-core` (see [frontend-stack.md](frontend-stack.md#compatibility-notes-found-by-the-check)).

## Testing

- Test behaviour through the accessible interface (`getByRole`, `getByLabelText`), with `userEvent`, never implementation
  details, never snapshots of markup.
- MSW stands in for the API. Test the failure statuses a screen can receive, not only success.
- Every component test covers each state the design defines (loading, empty, error, disabled, focus where relevant).
- A bug fix starts with a failing test.
- Pure functions (`lib`, mappers) get table-driven unit tests.

## Dependencies and versions

- Latest stable version of every dependency at the time it is added, checked with `npm view <pkg> version`; the whole tree
  must resolve **without** `--force` or `--legacy-peer-deps`. If a peer range blocks the latest version of something,
  choose the newest combination that resolves cleanly and write the pin and the reason in
  [frontend-stack.md](frontend-stack.md). A peer range that is stricter than reality may be lifted with a declared npm
  `overrides` entry, but only after the combination was exercised for real (generated, built, ran) and the entry is
  documented in `frontend-stack.md`, as the two existing ones are.
- A new dependency needs a one-line justification in the change that adds it, and must not duplicate one already chosen.

## Definition of done

A change is done when all of these hold:

1. `npm run lint`, `npm run build` and `npm run test` are green, with no warnings left behind.
2. New behaviour has tests, including failure statuses and each design state.
3. No architecture rule above is broken, and no TODO is left without a written reason.
4. The result was checked in the browser pane at 390, 768 and 1280 px against the design boards, including keyboard focus.
5. `strings.ts`, tokens and generated types are the only sources for text, design values and API shapes.
6. A self-review pass (reuse, simplification, leftover dead code) was done on the diff, and anything non-obvious learned is
   written in `docs/`.
7. A commit is proposed to the user with a message explaining the why.
