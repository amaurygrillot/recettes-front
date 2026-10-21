# Front-end stack

Decided in October 2026, before the first line of code. Each row says what was chosen, why, and what was rejected, so
the reasoning survives the conversation it came from.

## Summary

| Concern | Choice | Main alternative(s) rejected |
|---|---|---|
| Build / framework | Vite + React + TypeScript (strict), single-page app | Next.js / Remix (server rendering not needed) |
| Routing | React Router v7, data mode (`createBrowserRouter`) | TanStack Router |
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
