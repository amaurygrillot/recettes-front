# The API layer

How the front end talks to `recettes-back`, and the decisions behind it (M3, October 2026). `src/api` is a boundary:
it knows the contract, the session and TanStack Query, and **nothing about components or French text**. Screens use
its hooks and read `error.failure`; they never see a status code, a header or a problem+json body.

## What is in `src/api`

| File | Role |
|---|---|
| `schema.d.ts` | Generated from the back's `openapi.yaml` (`npm run api:generate`), committed. The only source of API types. |
| `apiConfig.ts` | The base URL (`http://localhost:8080`). No environment variable until the deployment layout is decided. |
| `client.ts` | The typed `openapi-fetch` client (`api`) and its two middlewares: auth and logging. |
| `unwrap.ts` | `unwrap(call)` / `unwrapEmpty(call)`: the only code that reads `error` from openapi-fetch. Turns every outcome that is not a success into a thrown `ApiRequestError`. |
| `failure.ts` | The `ApiFailure` union, `failureFromResponse` (the one status → kind mapper, pure), `ApiRequestError`, `isTransient`. |
| `tokenClaims.ts` | Reads the claims of the JWT (Zod): `sub` = username, `userId`, `roles` (`USER` / `ADMIN`, no `ROLE_` prefix), `exp`. The signature is **not** checked: the server stays the authority. |
| `sessionStore.ts` | The session: an external store kept in `sessionStorage` (key `recettes.token`). The only reader of the token. |
| `session.ts` | `useSession()`, `getSession()` (route loaders) and `signOut()`: the part of the store screens may use. |
| `queryClient.ts` | `createQueryClient()` and the registration of `ApiRequestError` as TanStack Query's default error type. |
| `auth.ts`, `users.ts`, `recipes.ts`, `referenceData.ts`, `ingredients.ts`, `media.ts`, `lists.ts` | The hooks, one file per resource. |
| `listKeys.ts` | The query keys of everything private to the member (two roots: `lists` and `list-covers`). |
| `privateData.ts` | `bindPrivateData`: empties the private queries as the session changes hands (see « Private data »). |
| `multipartFile.ts` | The body of an upload (one multipart part, `file`), shared by `POST /media` and `PUT /lists/{id}/cover`. |

Hooks that exist: `useLogin`, `useRequestPasswordReset`, `useCreateUser`, `useUpdateUser`, `useResetPassword`,
`useRecipeSearch` (infinite), `useRecipe`, `useCreateRecipe`, `useUpdateRecipe`, `useDeleteRecipe`, `useCategories`,
`useCategoryHierarchy`, `useTags`, `useUnits`, `useIngredientSearch`, `useCreateIngredient`, `useUploadMedia`, plus
`mediaUrl(id, variant)` for `<img src>`. **Lists** (`lists.ts`): `useLists`, `useListsContaining`, `useList`, `useListRecipes` (the content of a list, read through the
recipe search with `listId`; it shares `useRecipePages` with `useRecipeSearch`), `useCreateList`, `useUpdateList`, `useDeleteList`,
`useAddRecipeToList`, `useRemoveRecipeFromList`, `useSetListCover` (and `uploadListCover`), `useRemoveListCover` and `useListCover` (the photo, see below). **Not built on purpose**: the admin writes on categories, tags, units and
ingredients (no screen is designed for them yet), and the by-id reads of categories, tags, units and ingredients (the lists
cover every designed screen). Add them with the screen that needs them.

## Failures: one union, one mapper

Every failed call is an `ApiRequestError` whose `failure` is an `ApiFailure` (`failure.ts`). Screens `switch (failure.kind)`.

| Status | `kind` | Notes |
|---|---|---|
| no answer | `network` | Offline, server down, or a request the browser blocked (CORS). |
| 400 | `invalid-request` | `detail` is the back's explanation (English): the field that was wrong. Always displayed, never swallowed. |
| 401 | `unauthorized` | On login: wrong credentials. Elsewhere: no or broken token (see below). |
| 403 | `forbidden` | Also a wrong or missing `currentPassword` on `PUT /users/update`. |
| 404 | `not-found` | |
| 408 | `network` | Tomcat's answer to a client that stopped sending (a plain JSON body, not a problem): to the person, a connection that failed. |
| 409 | `conflict` | Duplicate username, e-mail, name. `reason` (`recipe-list-name-taken`, `too-many-recipe-lists`, `recipe-list-full`) comes from the problem's `type` (`urn:recettes:problem:…`), never from `detail`; any other 409 has none. |
| 413 | `payload-too-large` | Upload over 8 MB. |
| 429 | `rate-limited` | `retryAfterSeconds` from `Retry-After`. |
| 503 | `unavailable` | `retryAfterSeconds` from `Retry-After`. |
| other 5xx | `server-error` | |
| anything else | `unexpected` | 406, 415, a redirect, an empty success where a body was due, a bug on our side. |
| (the caller gave up) | `aborted` | An `AbortError`, decided in `unwrap.ts`: logged at `info`, never at `error`, and no screen says anything about it (`failureMessage` has a sentence only to keep its switch whole). |

The French sentence for each kind is `failureMessage()` in `src/app` (the api layer holds no text). A screen that knows
better overrides one kind (the login form says « identifiants incorrects » for a 401) and leaves the rest to it.

TanStack Query: queries retry transient failures twice (`network`, `unavailable`, `server-error`, `rate-limited`; `isTransient`, with TanStack's own backoff: `Retry-After` is not consulted) and never a
4xx; mutations never retry, since the user decides whether to try again. `ApiRequestError` is registered as the default
error type, so `query.error?.failure` is typed with no cast.

## Session and token

- `Session` is `visitor | member | expired`. `member` carries `username`, `userId`, `roles` read from the token. `expired`
  means « the back refused your token »: it is what the session-expired dialog listens to.
- A token left in the tab by a previous page load is resumed **only while it is not expired** (`exp`); otherwise it is
  forgotten. `sessionStorage` can throw (blocked storage): the session then lives in memory only.
- `login` answers the JWT as raw `text/plain`: `useLogin` reads it with `parseAs: 'text'`, trims it and hands it to
  `signIn`, which refuses a token it cannot read (the mutation then fails as `unexpected`).
- After `PUT /users/update` the claims in the token (the username) are stale until the next login. The account screen
  decides whether that matters.

### The 401 policy

The back's `JwtAuthenticationFilter` answers 401 to **any** request carrying a broken token, even on a public read, except
on the credential endpoints (`POST /auth/**`, `POST /users/create`, `PUT /users/reinit-password`). The auth middleware
therefore:

1. attaches `Authorization: Bearer …` to every request **except those four**, so a stale token can never block a login, a
   registration or a password reset (`isCredentialEndpoint`, which mirrors the back's list);
2. on a `401` for a request that carried a token: ends the session (`expire()`: token dropped, status `expired`, one
   notification however many requests were refused) and, **for a public `GET` only**, replays the request once without the token.
   Most reads are public, so a stale token never breaks a page: the page loads as for a visitor and the member is told.
   A write is not replayed: the `401` is the answer, and the screen keeps its content. **A private read is not replayed
   either** (`isPrivateRead`: `/lists…`, `/lists/{id}/cover`, and `GET /recipes` with a `listId`): a visitor has nothing to see
   there, so the replay could only earn a second `401`.
3. ignores a `401` for a request that carried no token (a visitor trying a protected write): that is not a session ending.

## Private data (lists and their photos)

Lists, what they hold, « déjà dans cette liste » and the photos of the lists belong to one member, and a device may be shared:
**nothing of one member may be on screen for the next** (decided with the lists, November 2026).

- **Where it lives.** Every private query is under one of two roots (`listKeys.ts`): `lists` (the lists, `containing`, the content of a list,
  which is the recipe search with `listId` but cached under `lists`, never under `recipes`) and `list-covers` (the photos, kept apart: a photo never
  changes behind its version, and touching a list must not refetch it).
- **When it goes** (`bindPrivateData`, bound by `RootLayout` to the session store, so it runs in the store's own notification, before any
  render with the new session): at **sign-out** (the session dialog's « Se reconnecter » is a sign-out), and at **every sign-in**, even of the
  same member, `resetQueries` empties every private query and tells the pages still mounted (a plain `removeQueries` would leave a mounted page showing its
  data until it rendered again). A sign-in also forgets what **other members** left on the device (`lib/memberStorage`).
- **When the session expires** (the page stays mounted under its dialog on purpose): the lists keep what they show, **only the photos go** — they are private,
  and an expired session is nobody's. `useListCover` shows nothing without a member, and the object URLs are revoked.
- **The photo.** An `<img src>` cannot carry the token, so `useListCover` fetches it with the typed client (`parseAs: 'blob'`) and `useObjectUrl`
  shows it from an object URL, shared by every component that shows the same blob and **revoked when the last stops**. The URL is in one order, because
  the browser caches by exact URL: `?v={coverVersion}&variant=thumbnail` for a tile, `?v={coverVersion}` for the banner. No conditional header is ever
  set from the script (it would make the browser bypass its own cache and hand over a bare `304`). A list with no photo (`coverVersion: null`) asks for nothing.
  A `404` for a version means the list changed: the list is read again, once; if it still points at that version the photo is missing on the server and is shown
  as absent (a `warn` in the logs), never asked for in a loop.
- **Drafts and notes to come back to** are kept under `recettes.member.<userId>.…` (`memberKey`): the recipe editor's draft (which was not keyed by member before), the list form's, the « open the sheet » intent.
  Another member's are forgotten at sign-in. The drafts of a member survive their own sign-out and session expiry, which is their purpose.
  Drafts written before this change (`recettes.draft.…`) have no owner: they are left where they are and nobody reads them any more.
- **Tested** with member A then member B in the same tab (`app/privateData.test.tsx`): lists, photo URL (revoked) and drafts.

## Rules for adding to it

- A request type is **never** written by hand: take it from `components['schemas']` or `paths[...]`.
- A new operation is `unwrap(api.VERB(...))` in a hook of its resource file; success without a body is `unwrapEmpty`.
- After a mutation, update or invalidate the queries it affects (`cacheSavedRecipe` in `recipes.ts` is the pattern: the saved
  recipe becomes the cached detail, the lists go stale).
- Log with `logger` (never a token, a password, an e-mail address or a query string).

## Testing it

MSW stands in for the back (`src/test/server.ts`, started in `src/test/setup.ts`; a request nobody answered fails the test:
`onUnhandledFrame: 'error'`). `src/test/problem.ts` builds `problem+json` answers; `src/test/fakeToken.ts` builds a token
shaped like the back's. Every operation of the contract has a test for each status its contract lists, plus `network`.

**jsdom and multipart.** jsdom brings its own `FormData` and `File`, which Node's `fetch` cannot serialise once a handler
reads the body (`RequestContentLengthMismatchError`). The multipart content of an upload is therefore checked in
`uploadMedia.test.ts`, which runs in the `node` environment; the hook's statuses are tested in jsdom without reading the body.
