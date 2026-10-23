# Setup plan

How the project gets from an empty repository to a first complete screen. Written so that a session with no memory of
the discussions can execute it: every milestone has a « done when » that can be checked, and the decisions are already
made. Update this file as milestones land.

## Decisions already made

- Stack: see [frontend-stack.md](frontend-stack.md). Package manager: **npm**. Node: **26**, chosen because it is about to become the LTS line (October 2026),
  pinned in `.nvmrc` and in `engines` of `package.json`.
- Code organisation: **by component and by screen** (below).
- Design source of truth: the Claude Design canvas; extracted values are in [design-tokens.md](design-tokens.md).
- Everything runs locally for now; deployment is out of scope. Back end on `http://localhost:8080` (started from the
  user's IDE), front on `http://localhost:5173`.

## Status

- **M1 · Skeleton and guardrails — done (2026-10-22).** One thing from the list was refused by the harness and is left to the
  user: `.claude/settings.json` (the allowlist for `npm run lint|test|build`, `git status|diff|log`), because it edits the agent's
  own permissions. `.claude/launch.json` exists.
- **M2 · Theme and base components — done (2026-10-22).** Components built: `Icon` (49 icons), `Logo`, `Button`, `Tag`, `FilterChip`,
  `TextField`, `Skeleton` with `LoadingRegion` (status region and 300 ms delay), `BowlIllustration` with `EmptyState`,
  `ErrorState` with `ErrorBanner`, `Avatar`. `IconButton`, `Toast`, `Dialog`, `BottomSheet`, the password toggle, textarea, select
  and checkbox are deliberately not built: they come with the first screen that needs them. Decisions left open on purpose, to
  take when the first screen needs them (all additive, none breaks an existing call site): `Button` rendered as a link
  (`asChild` with Radix `Slot`), a `headingLevel` on `EmptyState` / `ErrorState` for page-level use, a shared field frame once
  the password, textarea and select fields exist. The development-only
  `/styleguide` route (`src/screens/StyleguideScreen`) shows them and is absent from the production bundle.
- **M3 · API client and authentication — done (2026-10-23).** See [api-layer.md](api-layer.md). Every status of every operation the
  designed screens use is tested with MSW. **The live check was done on 2026-10-23, once the back end was running**: a login from the front works (confirmed by the user), the CORS preflight answers
`Access-Control-Allow-Origin: http://localhost:5173` with `Location` and `Retry-After` exposed, and calls made from the page at
`localhost:5173` through the typed client returned `200` for `/categories` (52) and `/recipes` (empty page, the database has no recipe yet) and a
parsed `404` problem+json for an unknown recipe id. Not exercised live: the 401-replay and a refused upload (429/503).
- **M4 · Router and shell — done (2026-10-23).** Routes below; pages with the navigation around them, and full-screen pages without
  (login, registration, password screens, cooking mode, the recipe editor: their boards draw no tab bar). `requireMember` is a route
  loader (it runs on entry, so a member whose session expires stays on the page and the dialog takes over). Decisions and divergences
  between boards are in [design-boards.md](design-boards.md#the-shell-m4).

- **M5 · HomeScreen — done (2026-10-23).** `/` shows the feed, the category shortcuts and every state of the boards, against the
  real API (checked live: categories answered, the feed was empty because the database has no recipe; the cards, the pages and
  the failures were checked with a mocked back end in the browser pane at 390, 768 and 1280 px). Shared work it needed: the
  desktop bar of the later boards, the extended « + », `CreateLink`, `Spinner` and `Button busy`, compact `EmptyState` /
  `ErrorState`, the page-title tokens, a vendor chunk split. Not exercised live: « Voir plus » (no recipes in the database).

## Code organisation

```
src/
  main.tsx
  app/                      router, providers (QueryClient, auth), layouts (AppShell, tab bar, top bar)
  screens/                  one folder per screen, named for the screen
    HomeScreen/             HomeScreen.tsx · HomeScreen.test.tsx · strings.ts · components/ (used by this screen only)
    SearchScreen/  RecipeScreen/  CookingScreen/  RecipeEditorScreen/ (create + edit)
    LoginScreen/  RegisterScreen/  ForgotPasswordScreen/  ResetPasswordScreen/  AccountScreen/  NotFoundScreen/
  components/               reusable components, one folder each (Component.tsx, test, strings.ts if it has text)
    Button/ Tag/ FilterChip/ TextField/ RecipeCard/ PhotoSlider/ BottomSheet/ Dialog/ Toast/ Skeleton/
    EmptyState/ ErrorState/ Avatar/ Logo/ Icon/ RichTextEditor/ RichTextView/ ...
  api/                      generated schema, typed client, error mapping, token module, query hooks per resource
  lib/                      logger and other small helpers with no UI
  styles/                   index.css: Tailwind theme from design-tokens.md, fonts
  test/                     setup.ts (Testing Library cleanup, jest-dom) and expectNoAccessibilityViolations (axe-core)
```

`scripts/` holds `generateApi.mjs` (`npm run api:generate`) and the test of the lint guardrails.

Rules:

- **A component used by one screen lives inside that screen** (`screens/X/components/`). It moves to `src/components/`
  when a second screen needs it, not before.
- Screens compose components and own data loading (TanStack Query hooks from `src/api`). Components in `src/components`
  are presentational: props in, events out, no API calls.
- `RichTextView` is the **only** place allowed to render stored HTML (it sanitises with DOMPurify first).
- Each folder has its own tests next to the code. French text lives in the folder's `strings.ts`, tutoiement.
- The generated `src/api/schema.d.ts` is **committed**, so the repository builds without the back-end repository next to
  it and contract changes show up in diffs.

Proposed routes (the reset path is fixed by the back's configuration):

| Route | Screen | Access |
|---|---|---|
| `/` | HomeScreen | public |
| `/rechercher` | SearchScreen | public |
| `/mes-recettes` | SearchScreen, author locked to the caller | logged in |
| `/recettes/:id` | RecipeScreen | public |
| `/recettes/:id/pas-a-pas` | CookingScreen | public |
| `/recettes/nouvelle` | RecipeEditorScreen (create) | logged in |
| `/recettes/:id/modifier` | RecipeEditorScreen (edit) | author or admin |
| `/connexion` · `/inscription` · `/mot-de-passe-oublie` | auth screens | public |
| `/reset-password` | ResetPasswordScreen (`?token=…&email=…`) | public, **fixed path** |
| `/compte` | AccountScreen | logged in |

## Before starting

1. The back end's CORS change is merged and running (allowed origin `http://localhost:5173`, `Location` and `Retry-After`
   exposed). Without it every call from the browser fails. Check with a request from the front, not by assumption.
2. The e-mail length alignment and the password-reset URL (`http://localhost:5173/reset-password`) are in as well.
3. Try Claude Design's hand-off to Claude Code on **one** screen (the home page) and note in this file what it actually
   delivers, because it decides how every later screen is implemented.

## Milestones

Each milestone ends with `npm run lint`, `npm run build` and `npm run test` green, and a commit proposal to the user.

**M1 · Skeleton and guardrails.** Vite + React + TypeScript generated with npm (versions: see
[frontend-stack.md](frontend-stack.md#versions)); ESLint, Prettier, Tailwind, Vitest + Testing Library + an `axe-core` test helper; the two `overrides` and
`skipLibCheck: true` documented in `frontend-stack.md`;
`.nvmrc`, `engines`, scripts (`dev`, `build`, `lint`, `test`, `api:generate`), `.gitignore` (including `.idea/`); the
folder layout above with empty folders omitted; a `.claude/launch.json` for the dev server and a `.claude/settings.json`
allowing the safe repetitive commands (`npm run lint|test|build`, `git status|diff|log`).
The **architecture is enforced by tooling from day one**, per [engineering-standards.md](engineering-standards.md):
the strict TypeScript flags listed there; ESLint with `react-hooks`, `jsx-a11y`, `typescript-eslint` strict-type-checked,
the import-boundary rules (screens → components → lib, `api` only used by screens), a ban on `console.*`, on `any`, and on
`dangerouslySetInnerHTML` outside `RichTextView`. Prove the boundary rules work with a throw-away violation that fails lint.
*Done when:* `npm run dev` serves a page on 5173, the three checks pass, and a deliberate boundary violation is rejected by
lint. Update the « Status » section of `CLAUDE.md` and the installed versions in `frontend-stack.md`.

**M2 · Theme and base components.** Tailwind theme from [design-tokens.md](design-tokens.md), self-hosted fonts, the
`Icon` set, `Logo`, then `Button`, `Tag`, `FilterChip`, `TextField` (all states), `Skeleton`, `EmptyState`, `ErrorState`,
`Avatar`. A development-only `/styleguide` route displays them. *Done when:* the styleguide visibly matches the design
system boards on a 390 px viewport (check in the browser pane) and every component has a test for its states.

**M3 · API client and authentication.** `api:generate` (path to the back's `openapi.yaml`, overridable by an environment
variable); typed `openapi-fetch` client; `problem+json` error mapping; the `text/plain` login; the token module in
`sessionStorage`; stale-token handling on public routes; the session-expired dialog; the logger wrapper; MSW handlers for
tests. *Done when:* a test with MSW covers login success, 401, 403, 404, 409, 429 with `Retry-After`; and a manual call to
`GET /recipes` against the running back end returns data in the browser.

**M4 · Router and shell.** `createBrowserRouter` with the routes above (placeholders for screens), protected-route
handling, the bottom tab bar (visitor and member variants) and the top bar from 1024 px, the floating « + ».
*Done when:* navigation works for a visitor and a logged-in user on phone and desktop widths, and a protected route
redirects a visitor to the login screen then back.

**M5 · HomeScreen end to end — done (2026-10-23).** See [design-boards.md](design-boards.md#homescreen-m5). Implemented from the canvas boards listed in
[design-boards.md](design-boards.md), against the real API: category shortcuts, recipe feed, « Voir plus »
(infinite query), skeletons, error, empty, visitor and member variants. *Done when:* it matches the boards at 390, 768 and
1280 px and every state is tested. **This screen is the quality template for all the others.**

After M5, screens can be built independently, in separate sessions, in this order of value: SearchScreen, RecipeScreen,
auth screens, AccountScreen, RecipeEditorScreen, CookingScreen, then admin (not yet designed). RecipeEditorScreen needs
the `RichTextEditor` (Lexical) and `RichTextView` components first.

## Known follow-ups

- **Finish the LoginScreen (decided 2026-10-23: a later session, with the other auth screens).** M4 shipped a working stand-in
  (`src/screens/LoginScreen`: username and password, validation, a banner for a refused login and for the other failure causes,
  return to the page that asked for the login). Still to build from the « Marque-ecrans » board: the butter band with the large seal on
  the phone and the butter panel beside the form on desktop (checked at 390, 768 and 1280 px, only 390 px was looked at in M4), the
  password show/hide toggle (`Champs-avances` board), the brick outline on the field concerned by a refused login, and the
  registration, forgot-password and reset-password screens that its links lead to (placeholders today). The first field stays
  « Nom d'utilisateur » until the board's « Adresse e-mail » is reconciled with the API, which logs in by username only.
- **Each screen adds its own desktop « Nouvelle recette »** where its board draws it (the bar no longer has one, since M5);
  until then the placeholders have none. SearchScreen also reads `?categorie=` and `?q=` ([design-boards.md](design-boards.md#the-shell-m4)),
  promotes `RecipeCard` from `screens/HomeScreen/components` to `src/components` (its second user), and may keep the bar's
  search field in step with the page's text.
- **API hooks not built yet**: admin writes on categories, tags and units, ingredient rename and delete, and the by-id reads of
  reference data. Add them, with their status tests, with the first screen that needs them ([api-layer.md](api-layer.md)).

## Working with agents

- **Agents are autonomous.** They decide on their own everything a competent engineer would decide (names, small structure,
  library details within the chosen stack, how to test), write down the non-obvious ones in `docs/`, and ask the user only
  when blocked by something they cannot resolve (back end down, a contradiction between the design and the API that changes
  what the user sees).
- One milestone or one screen per session. Start every session from a prompt in [kickoff-prompt.md](kickoff-prompt.md); every
  prompt makes [agent-operating-rules.md](agent-operating-rules.md) and
  [engineering-standards.md](engineering-standards.md) binding, including the definition of done.
- Sessions may touch only the files of their milestone or screen, plus shared components they genuinely need. Two sessions
  never edit the same files at once.
- A session ends with the checks green, a self-review of its diff done, and a commit *proposed*, not made (the user's
  standing rule is to approve commits). Nothing is ever pushed.
- Anything learned that is not obvious from the code (hand-off behaviour, a canvas ambiguity, an API quirk) is written into
  `docs/` or `CLAUDE.md` before the session ends.
