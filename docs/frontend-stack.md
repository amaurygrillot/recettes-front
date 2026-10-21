# Front-end stack

Decided in October 2026, before the first line of code. Each row says what was chosen, why, and what was rejected, so
the reasoning survives the conversation it came from.

## Summary

| Concern | Choice | Main alternative(s) rejected |
|---|---|---|
| Build / framework | Vite + React + TypeScript (strict), single-page app | Next.js / Remix (server rendering not needed) |
| Routing | React Router v8, data mode (`createBrowserRouter`) | TanStack Router |
| API client | `openapi-typescript` + `openapi-fetch`, generated from the back's `openapi.yaml` | Hand-written types; Orval / generated hooks |
| Server state | TanStack Query | `useEffect` + `useState` by hand; router loaders alone |
| Forms | React Hook Form + Zod | TanStack Form, Formik, React 19 form actions, hand-rolled state |
| Rich text | Lexical (+ DOMPurify at render) | Tiptap, Slate / Plate, Quill, CKEditor / TinyMCE, Markdown textarea |
| Styling | Tailwind CSS with the design-system tokens as theme values | CSS Modules |
| Accessible components | Radix UI primitives, unstyled | Writing focus management by hand |
| Drag and drop | dnd-kit, plus move up / move down buttons | Native HTML5 drag and drop |
| Token storage | `sessionStorage` | `localStorage`, memory only, `HttpOnly` cookie |
| Tests | Vitest, Testing Library, MSW, Playwright | — |
| Lint / format | ESLint + Prettier | — |

## Versions

The rule is the user's: **always the latest stable version**, checked when the dependency is added (`npm view <pkg>
version`), with a tree that resolves without `--force` or `--legacy-peer-deps`. State of play when this was written
(October 2026, from public sources, to be re-checked at install time):

The compatibility of the **whole set** was verified on 2026-10-21 in a throw-away project (Node 26.12.1, npm 11.20): the full
tree resolves and installs, the contract's types generate, the strict type-check passes (with `skipLibCheck: true`, and
apart from the `vitest-axe` matcher types that are replaced as described below), `vite build` succeeds, a Vitest run
using React, Router, TanStack Query, React Hook Form + Zod, openapi-fetch, MSW, DOMPurify, Radix, dnd-kit, Lexical and an
axe accessibility check passes, and ESLint rejects a deliberately bad file. Not exercised: Playwright against a browser
(its version was only checked to install), Prettier, and the Lexical extension-based API. The versions below are what that project
resolved; **re-run `npm view` when scaffolding**, since newer releases may exist by then.

| Package | Version | Note |
|---|---|---|
| Node / npm | 26.x / 11.x | |
| `react`, `react-dom` | 19.3.1 | Latest 19.x line; no React 20 |
| **`typescript`** | **~6.0.3** | **7.0.2 is the latest but cannot be used yet, see below** |
| `vite` · `@vitejs/plugin-react` | 8.3.5 · 6.1.2 | Rolldown-based Vite; plugin 6 requires Vite 8 |
| `react-router` | 8.5.0 | v8, not v7; `createBrowserRouter` and `RouterProvider` unchanged |
| `@tanstack/react-query` | 5.104.x | |
| `openapi-typescript` · `openapi-fetch` | 7.13.0 · 0.17.0 | Peer range is `typescript ^5.x`, see overrides |
| `react-hook-form` · `@hookform/resolvers` · `zod` | 7.90.0 · 6.0.0 · 4.6.7 | |
| `lexical`, `@lexical/*` | 0.52.0 | Pre-1.0: pin the exact version |
| `dompurify` | 3.4.x | |
| `radix-ui` | 1.8.x | Unified package |
| `@dnd-kit/core` · `@dnd-kit/sortable` | 6.3.1 · 10.0.0 | See note on types |
| `tailwindcss` · `@tailwindcss/vite` | 4.3.3 | |
| `vitest` · `@vitest/coverage-v8` | 5.0.5 | Needs Node 22.12+ / 24+ / 26+ |
| `@testing-library/react` · `/dom` · `/user-event` · `/jest-dom` | 16.3.x · 10.x · latest · latest | |
| `msw` | 3.0.3 | Major 3: see note |
| `axe-core` | 4.14.x | Used directly, see note |
| `@playwright/test` | 1.64.1 | |
| `eslint` · `typescript-eslint` | 10.13.0 · 8.72.0 | |
| `eslint-plugin-react-hooks` · `-jsx-a11y` · `-boundaries` | 7.1.1 · 6.10.2 · 7.2.1 | |
| `prettier` · `prettier-plugin-tailwindcss` | 3.9.x · 0.8.x | |

### Why TypeScript 6.0.3 and not 7.0.2

TypeScript 7.0.2 is the latest release and, used alone, it type-checks the project fine. But two tools of the chain cannot
use it yet: `typescript-eslint` 8.72 declares `typescript <6.1.0` as its peer range, and `openapi-typescript` crashes when
run on TypeScript 7 (it depends on the JavaScript compiler API, which the native compiler does not provide). TypeScript
6.0 is the last JavaScript-based release, so it is the highest version the whole chain accepts. **Revisit when
`typescript-eslint` and `openapi-typescript` both support 7.**

### `package.json` overrides (declared, not forced)

Two peer ranges are stricter than reality. Both are lifted with npm's `overrides`, which keeps the install free of
`--force` and `--legacy-peer-deps`, and each was exercised for real:

```json
"overrides": {
  "openapi-typescript": { "typescript": "$typescript" },
  "eslint-plugin-jsx-a11y": { "eslint": "$eslint" }
}
```

- `openapi-typescript` declares `typescript ^5.x`; with TypeScript 6.0.3 it generates exactly the same 63 KB schema from
  the real `openapi.yaml` as with 5.9.3.
- `eslint-plugin-jsx-a11y` 6.10.2 (last published October 2024) declares `eslint ^9`; with ESLint 10 its rules do run
  (a missing `alt` is reported). ESLint 9.39 is already marked unsupported, so staying on it was not an option. This is an
  unsupported combination: if jsx-a11y ever breaks on a newer ESLint, replace it rather than pin ESLint back.

### Compatibility notes found by the check

- **`openapi-fetch` binds `fetch` when the client is created**, so MSW (which patches `fetch` later) is bypassed and
  requests hit the network. Create the client with `fetch: (request) => globalThis.fetch(request)`.
- **MSW 3 renamed `onUnhandledRequest` to `onUnhandledFrame`** in `server.listen(...)`.
- **`@dnd-kit/core` 6.3.1 uses the global `JSX` namespace** that React 19's types removed, and
  `@testing-library/jest-dom` types clash with Vitest 5's `Assertion` type. Both only show up with `skipLibCheck: false`;
  keep **`skipLibCheck: true`** (Vite's default). `@dnd-kit/react` (0.5.x) is the pre-1.0 successor if the classic package
  becomes a problem.
- **`vitest-axe` 0.1.0 was last published in January 2025** and its matcher types do not extend Vitest 5. Use
  **`axe-core` directly** through a small test helper (`expectNoAccessibilityViolations(container)`) instead of that wrapper.
  Color contrast cannot be computed by jsdom (a harmless « getContext not implemented » message appears); contrast is
  guaranteed by the design tokens.
- **`LexicalComposer` is deprecated in Lexical 0.52** in favor of the extension-based `LexicalExtensionComposer`
  (`@lexical/react`). Build the editor on the extension API from the start; confirm the exact import against the Lexical
  documentation at implementation time.
- A first `vite build` of the smoke project produced a single 777 KB chunk: plan route-level code splitting (React Router
  lazy routes) rather than discovering it later.

## Why a single-page app

Nothing here needs server rendering: the content is for friends and family, search engines are irrelevant, and the API
is already a separate service. The one real cost is that a recipe link shared in a messaging app has no rich preview
(photo and title). That is accepted for now; it can be addressed later with a small prerender or an edge function
without changing the application structure.

## API types come from the contract

`recettes-back/src/main/resources/openapi/openapi.yaml` is the contract for the whole REST API and is edited first on the
back end. The front generates its types from it (`openapi-typescript`) and calls the API through a typed
`openapi-fetch` client, so a contract change shows up as a compile error instead of a runtime surprise.

Known irregularities the client has to absorb: the login endpoint answers a bare `text/plain` token, errors are
`application/problem+json`, and the two paged searches are hand-written on the back (their schemas exist in the YAML).

## TanStack Query is a cache of server state, not a replacement for a back-end cache

It stores API responses in the browser. It exists to solve interface problems: showing the list instantly when the user
navigates back, not reloading a recipe just left, marking lists stale after a create or update, driving the loading and
error states, paginating « Voir plus » as an infinite query, and discarding an old response that arrives after a newer
one during a search.

A server-side cache (Ehcache, Redis, Spring Cache) solves a different problem: load on the server and database, shared
by all users. With a handful of users and PostgreSQL behind the API it is unnecessary, and would add a component and a
source of stale data. The middle layer that does matter is **HTTP caching of photos** (`Cache-Control` / `ETag` on
`GET /media/{id}`); that is a back-end item to verify later.

React Router's loaders alone were not enough: they load on navigation but give no shared cache and no infinite
pagination.

## Forms: React Hook Form + Zod

The recipe editor is the deciding case: nested dynamic lists (ingredient groups containing ingredient lines, reorderable
steps containing pictures). React Hook Form's `useFieldArray` handles that well and avoids re-rendering the whole form on
each keystroke.

- *TanStack Form*: very strong typing, but newer, with fewer resources and more verbose.
- *Formik*: familiar but little maintained and slower on large forms.
- *React 19 form actions*: fine for the login form, insufficient for dynamic lists and fine-grained validation.
- *Hand-rolled state*: the editor would not stay manageable.

Zod duplicates some limits that already live in `openapi.yaml` (maximum lengths, required fields). To stay close to DRY
without adding a schema generator, the schemas are written by hand **for forms only**, mirror the contract, and are
always backed by the server's validation, whose `400` is displayed rather than swallowed. If the duplication starts to
drift, revisit with a generator.

## Rich text: Lexical

The back stores step instructions, the introduction and the recommendations as markup (see the back's
`docs/recipes-domain-model.md`, « WYSIWYG text columns »). Requirements: a WYSIWYG editor, **fully free tooling**, a
minimal toolbar.

- Lexical is MIT-licensed, light and accessible. The cost: the toolbar, the active-state detection of its buttons and
  the HTML conversion in both directions (`@lexical/html`) are written by hand.
- Tiptap would have provided more out of the box and its core is free too; it was passed over to keep to a fully
  open, lower-level tool.
- Slate / Plate: flexible but lower-level or less stable. Quill: weaker React fit, less active. CKEditor / TinyMCE:
  heavy, licensing constraints, hard to match to the visual identity. A Markdown textarea is not WYSIWYG, and the back
  expects markup.

Consequences:

- Lexical rebuilds its content from the stored HTML when a recipe is reopened and **drops tags it does not know**. This
  is a useful extra filter, but it is not a sanitiser.
- **Sanitise at render with DOMPurify, always.** The back stores the author's markup unchanged, so the front is the only
  place the stored-XSS surface can be closed. One shared rendering component does it.
- Lexical was still a 0.x library when this was written; pin the exact version and check the changelog before upgrading.
- Contenteditable editors have quirks with Android keyboards: test on a real phone early.

Toolbar: bold, italic, bulleted list, numbered list, undo, redo. No headings, colors, images or links.

## Token storage: `sessionStorage`

Any script running on the page can read both `localStorage` and `sessionStorage`; neither protects against XSS. The
difference is lifetime: `localStorage` survives closing the browser and is shared across tabs, `sessionStorage` dies
with the tab. Tokens last about an hour and are not refreshed, so persistence would add almost nothing, and the shorter
lifetime is the better default. The real defences are the sanitiser above and a Content-Security-Policy to add at
deployment. An `HttpOnly` cookie would hide the token but needs CSRF handling and a back-end change, since the API reads
an `Authorization` header.

## Open items

- **Session length.** An hour with no refresh will sign users out in the middle of a recipe. To be solved on the back
  end (longer lifetime or refresh); until then the editor keeps a local draft and shows a session-expired dialog.
- **Deployment.** Everything is local for now. Same domain behind a reverse proxy (no CORS in production) or separate
  domains is to be decided later; the back's routes currently have no prefix.
- **PWA / offline** (installable, readable offline, screen kept awake in cooking mode) is a separate, later batch.
- **Test coverage target** for the front is not set yet.
