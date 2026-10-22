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

The project has **not been scaffolded yet** (only documentation). Start from [docs/setup-plan.md](docs/setup-plan.md)
(milestones with checkable « done when ») and the ready-to-paste prompts in
[docs/kickoff-prompt.md](docs/kickoff-prompt.md) (agents follow [docs/agent-operating-rules.md](docs/agent-operating-rules.md);
canvas boards per screen are in [docs/design-boards.md](docs/design-boards.md)). Package manager: **npm**; Node: **26** (about to become LTS), pinned in
`.nvmrc` and `engines`. The commands below are the intended ones and become real once the Vite project exists; update
this section in the same change that creates them.

```bash
npm run dev            # Vite dev server, http://localhost:5173
npm run build          # type-check + production build
npm run test           # Vitest
npm run lint           # ESLint
npm run api:generate   # regenerate API types from ../recettes-back openapi.yaml
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
