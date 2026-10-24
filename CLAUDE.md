# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`recettes-front` is the web front end of a recipe library whose REST API lives in the sibling repository
`recettes-back` (Spring Boot, `C:\Users\Amaury\Documents\Projets\recettes-back`). It is a work-in-progress hobby project
built solo, for personal / friends-and-family use, with no revenue goal: favor correctness, learning and code quality
over speed.

- **Mobile first.** It is used in a kitchen, phone propped on the counter, hands often dirty. Large touch targets
  (56 px minimum, 64 px for primary actions and in cooking mode), text readable at arm's length.
- **The interface is in French and always addresses the user informally** (« Ajoute ta première recette », never
  « vous »). All user-facing text goes through one place (see Conventions), never scattered string literals.
- **Visual identity**: warm and handcrafted, yellow dominant, text on yellow always dark (WCAG AA).

Always use the latest available version of each technology and dependency when adding or upgrading, unless the user
says otherwise. Follow clean-code principles (DRY, KISS, SRP) as in my global `~/.claude/CLAUDE.md`.

## Status

**Milestones M1 (skeleton and guardrails), M2 (theme and base components), M3 (API client and authentication), M4
(router and shell) and M5 (the home screen, the quality template for the others) are done**; SearchScreen (`/rechercher`, `/mes-recettes`), RecipeScreen (`/recettes/:id`), the auth screens (sign-in, registration, forgotten and new password) AccountScreen (`/compte`) and RecipeEditorScreen (`/recettes/nouvelle`, `/recettes/:id/modifier`) are done too; next is CookingScreen. The plan, with the status of each milestone, is [docs/setup-plan.md](docs/setup-plan.md); the ready-to-paste
prompts are in [docs/kickoff-prompt.md](docs/kickoff-prompt.md) (agents follow
[docs/agent-operating-rules.md](docs/agent-operating-rules.md); canvas boards per screen are in
[docs/design-boards.md](docs/design-boards.md)). Package manager: **npm**; Node: **26** (about to become LTS), pinned in
`.nvmrc` and `engines`.

What exists: the Vite + React + TypeScript project, the strict TypeScript flags, ESLint with the import boundaries and the bans
(tested by `scripts/eslintGuardrails.test.ts`), the Tailwind theme from the design tokens, self-hosted fonts, the base
components in `src/components/` (Icon, Logo, Button, LinkButton, Tag, FilterChip, TextField, Skeleton, LoadingRegion, EmptyState,
BowlIllustration, ErrorState, ErrorBanner, Avatar, AlertDialog, TabBar, TopBar), and a development-only **`/styleguide`** route that
displays the base ones. M3: the API layer in `src/api` ([docs/api-layer.md](docs/api-layer.md)): generated schema, typed client,
one error union, the session and token module, query hooks per resource, MSW in every test, and the logger in `src/lib`. M4:
the router, the shell (phone tab bar with the « + », desktop top bar from 1024 px with a search field and the member's avatar,
login-protected routes that come back after the login, the session-expired dialog, a 404 and error boundaries), a first **LoginScreen** (finished later with the other auth screens). M5: the **HomeScreen** (`src/screens/HomeScreen`: feed with « Voir plus », category shortcuts, every state), the
extended « + » (`useCreateButtonMode`), `CreateLink`, `Spinner`, `Button busy`. Not there yet: the cooking mode (its route shows a `ScreenPlaceholder`). `RecipeCard`, the grid and « Voir plus » are shared components; the desktop « Nouvelle recette » lives in each page's header, not in the bar. The RichTextEditor (Lexical 0.52.0, pinned, extension API) is a shared component (the recipe editor uses it for the introduction, the steps and the tip). AccountScreen added `Toast` (with `ToastsProvider` / `useToasts` in `RootLayout`), `SectionIndex` and `useMember`; the back end has no way to read the signed-in account, so the page only knows what a registration or a change in the same visit returned (`useKnownAccount`). The auth screens added `AuthFrame`, `PasswordField`, `StateBadge` and the `auth` strings / `authValidation` shared by the entry forms. RecipeScreen added `PhotoSlider`, `PhotoViewer`, `RichTextView` (DOMPurify: the only place stored HTML is rendered), the `TabBar` slot (`BottomSlotContext`) for a page's bottom bar, `useGoBack`, `canManageRecipe` and `cookingProgress`. RecipeEditorScreen added `AutocompleteField`, `SelectField`,
`TextArea`, `ChoiceField`, `ProgressBar`, the shared recipe deletion (`DeleteRecipeDialog`, `useRecipeDeletion`) and dnd-kit; its drafts, uploads and reordering are described in [docs/design-boards.md](docs/design-boards.md#recipeeditorscreen-recettesnouvelle-and-recettesidmodifier).

```bash
npm run dev            # Vite dev server, http://localhost:5173 (port is fixed: strictPort); /styleguide shows the components
npm run build          # type-check (tsc -b) + production build
npm run test           # Vitest (components, lib, and the lint guardrails)
npm run lint           # ESLint, no warning allowed
npm run format:check   # Prettier (npm run format to fix); Markdown is left as written
npm run api:generate   # regenerate src/api/schema.d.ts from ../recettes-back openapi.yaml (OPENAPI_PATH overrides the path)
```

The back end runs on port 8080 (started from the user's IDE). The back's CORS allowed origin and the password-reset
e-mail link are both configured for `http://localhost:5173`; if the dev port changes, the back's configuration has to
change with it.

## Stack (decided, see [docs/frontend-stack.md](docs/frontend-stack.md))

Vite · React · TypeScript (strict) · React Router v8 (data mode, `createBrowserRouter`) · TanStack Query ·
`openapi-typescript` + `openapi-fetch` · React Hook Form + Zod · Lexical (rich text) + DOMPurify · Tailwind CSS ·
Radix UI primitives (unstyled, accessible) · dnd-kit · Vitest + Testing Library + MSW · Playwright · ESLint + Prettier.

Versions: always the latest stable of each, **verified together** (see the table in
[docs/frontend-stack.md](docs/frontend-stack.md#versions)). Notably **TypeScript is `~6.0.3`, not 7**, until
`typescript-eslint` and `openapi-typescript` support 7, and two declared npm `overrides` lift stale peer ranges. Create the
`openapi-fetch` client with `fetch: (request) => globalThis.fetch(request)` so MSW can intercept it. Do not add a library
that overlaps one of these without writing the decision down in `docs/`.

**Code quality is the priority of this project.** Read [docs/engineering-standards.md](docs/engineering-standards.md)
before writing code: SRP/DRY/KISS applied to React and TypeScript, import-boundary rules enforced by lint, strict
TypeScript with no `any` or casts, hooks for logic, tests through the accessible interface, and a definition of done.

## Code organisation

**By screen and by component** (full layout and routes in [docs/setup-plan.md](docs/setup-plan.md)):

- `src/screens/<Name>Screen/` — one folder per screen, with its test and its `strings.ts`. A component used by only one
  screen lives in that screen's `components/` folder and is promoted to `src/components/` when a second screen needs it.
- `src/components/<Name>/` — reusable, presentational components (props in, events out, no API calls), one folder each,
  with tests.
- `src/api/` — generated schema, typed client, error mapping, token module, TanStack Query hooks.
- `src/app/` (router, providers, layouts), `src/lib/` (logger, helpers), `src/styles/` (Tailwind theme).

Design values (colors, type scale, spacing, grid, icons) are extracted in
[docs/design-tokens.md](docs/design-tokens.md); the canvas stays the source of truth.

## The API contract

**`recettes-back/src/main/resources/openapi/openapi.yaml` is the contract.** API types are generated from it with
`openapi-typescript`; never hand-write a request or response type, and never copy one from the back's Java records.
When the contract changes, regenerate and let the compiler show what broke.

Things the generated client does not hide:

- `POST /auth/login` returns the JWT as a **raw `text/plain` body**, not JSON. Wrap it once, in the auth module.
- Errors are `application/problem+json` (`ProblemDetail`). Map them in one place; screens never parse error bodies.
- `GET /recipes` and `GET /ingredients` are hand-written on the back (paged responses). Their schemas are still in the
  YAML; the page shape is Spring Data's `PageImpl`.
- Creation answers carry a `Location` header; `429` and `503` carry `Retry-After`. The back exposes both through CORS.
  Use `Retry-After` for messages such as « réessaie dans 30 secondes ».
- Status codes mean something: `400` validation, `401` missing/invalid/expired token, `403` not allowed (also wrong
  current password on account updates), `404` missing, `409` duplicate username or e-mail, `413` file too large,
  `429` upload rate limit. Show the message that matches the code; do not collapse them into a generic error.
- Only these data exist: a recipe has title, introduction, recommendations, author, categories, tags, cover pictures,
  ingredient groups (optional title; quantity, unit and note are optional per line) and steps (with optional pictures).
  **There is no prep time, servings, difficulty, rating, favorites, shopping list, sharing, account deletion or profile
  photo.** Do not invent UI or placeholder data for them.

## Authentication

- The JWT lives in **`sessionStorage`** (decision and reasoning in `docs/frontend-stack.md`); it is read through a
  single auth module, nowhere else.
- Tokens last about an hour and there is no refresh. On any `401` for a request that carried a token, show the
  session-expired dialog and **keep the user's work** (see Drafts). Public routes must keep working with a stale token:
  the back deliberately ignores broken tokens on login, registration and password reset, and the front should simply drop
  the stale one.
- Password-reset e-mails link to `/reset-password?token=…&email=…`. **That path is fixed by the back's configuration**
  (`app.password-reset.frontend-reset-url`); change both together or not at all.
- Roles: `USER` can write recipes and create ingredients; only `ADMIN` can create or change categories, tags, units.
  Gate the UI on the roles from the token, but the server stays the authority.

## Rich text

Step instructions, the introduction and the recommendations are rich text, stored by the back **as HTML, unsanitised**
(the back records what the author wrote). That makes the front the only place a stored-XSS hole can be closed:

- Every rich-text rendering goes through **one** component that sanitises with DOMPurify before using
  `dangerouslySetInnerHTML`. Using `dangerouslySetInnerHTML` anywhere else is a bug.
- The editor is Lexical with a deliberately minimal toolbar: bold, italic, bulleted list, numbered list, undo, redo.
  No headings, colors, images or links. Pin Lexical's exact version (it is a 0.x library at the time of writing).

## Conventions

- **TypeScript strict, no `any`.** Prefer narrowing over casts.
- **Server state belongs to TanStack Query, UI state to components.** Do not copy fetched data into component state.
  Invalidate the relevant queries after a mutation.
- **Forms**: React Hook Form + Zod. The server is the final authority on validation; the Zod schemas mirror the contract's
  limits for early feedback, and a server `400` is always displayed, never swallowed.
- **User-facing text** lives in a `strings.ts` next to each screen or component, in French, tutoiement. No inline
  French literals in components.
- **Logging**: never `console.log`. Use the project's small logger wrapper (levels debug/info/warn/error, quiet in
  production) for the key steps of a flow: navigation to a protected route, login/logout, calls that fail, session
  expiry, uploads. Never log tokens, passwords or e-mail addresses.
- **Accessibility**: real `<button>`/`<a>`, a visible label on every input, focus states, icon-only buttons have an
  accessible name. Use Radix primitives for dialogs, sheets, menus and selects rather than reimplementing focus handling.
- **Design**: the source of truth is the Claude Design canvas « Il en reste un peu - Design system »
  (https://claude.ai/artifact/F1LCSxWHJTzDJ2qaT9Jxm9). Colors, type scale, spacing, radii, shadows and components come
  from its boards; express them as Tailwind theme tokens, never as one-off values in components.
- **Drafts**: the recipe editor keeps a local draft so that an expired session or a network failure never loses a long
  recipe.

## Testing

Tests use Vitest and Testing Library, with MSW standing in for the API in component tests. A few Playwright journeys
run against the real back end in local development. Whenever a screen depends on an endpoint, test the failure statuses
it can answer (see the table above), not only the success. The coverage target has not been set yet: decide it with the
user when the first features land.

## Documentation

There is no external wiki. Every non-obvious design or product decision goes in `docs/`, written when the decision is
made and kept up to date when it changes. This file stays focused on operational guidance for working in the codebase.

## Git

Ask before committing or pushing. If the user is on `main`, offer to create a short descriptive feature branch first.
