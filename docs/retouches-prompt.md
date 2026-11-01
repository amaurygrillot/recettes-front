Read CLAUDE.md, docs/engineering-standards.md, docs/setup-plan.md and docs/agent-operating-rules.md first, then docs/design-boards.md.

Context: recettes-front is the React + TypeScript front end of a mobile-first recipe library (French, informal "tu"). The API lives in the sibling repo recettes-back and is never edited. Every product screen is built and merged into main. The design canvas « Il en reste un peu - Design system » (https://claude.ai/artifact/F1LCSxWHJTzDJ2qaT9Jxm9) has a new page, **« Retouches »**, with five design changes to apply on top of the existing screens. The boards of that page are the source of truth for them, and they override the older boards they name ("ce qui change dans les planches").

Read the boards with the Artifact tool (`action: "read"`, that url, `path: "project/<file>"`) and read their text and layout, not only a screenshot. Never publish to or edit the canvas.

| Retouche | Boards (`project/…dc.html`) |
| --- | --- |
| R1 · search opens as an overlay | `Retouche-1-principe`, `Retouche-1-mobile`, `Retouche-1-grands-ecrans`, `Retouche-1-resultats` |
| R2 · new logo, the cocotte (validated) | `Retouche-2-cocotte` |
| R3 · rich text | `Retouche-3-texte-riche-mobile`, `Retouche-3-texte-riche-grands-ecrans` |
| R4 · mascot « Mijotine » and logo in situ | `Retouche-4-mascotte`, `Retouche-4-situations`, `Retouche-4-logo-en-situation` |
| R5 · cooking step without the badge | `Retouche-5-etape-sans-badge` |

## Task

Implement the five retouches, in this order, one at a time: **R5, R2, R4, R3, R1** (smallest and independent first; R4 reuses the R2 logo; R1 is the largest and touches routing and the shell). Work from main, one branch and one PR per retouche. Before each one: write its decisions in `docs/` (update `docs/design-boards.md` with the new boards and mark the older boards or parts they replace), then implement.

- Respect CLAUDE.md: no `any` or casts, French text only in `strings.ts`, design tokens only (add a token rather than a one-off value), reuse and promote shared components, log key steps with the project logger.
- You may commit, push, open PRs, merge and pull without asking, **but only through the process below**: a retouche is never merged before its gates pass.
- You work fully autonomously: never ask me a question and never wait for an answer (see « Never wait for me »).

## Process (applies to every retouche, no shortcut)

Keep the task list (plan) up to date with these steps for each retouche.

**1. Plan.** Read the boards, then write down in `docs/` the decisions and the list of what changes (files, components, strings, tokens, tests). Update `docs/design-boards.md` (new boards, older boards or parts they replace). List the visual states to check (every state drawn on the boards, at 390, 768 and 1280 px) as a checklist in the PR description from the start.

**2. Build, in small commits.** Test first, through the accessible interface (Vitest + Testing Library + MSW), including every failure status of the endpoints involved. One commit per coherent step, message explaining why. Update or delete the tests of behaviour the retouche removes; never leave dead code, dead tests, unused strings, unused exports or commented-out code. Stay inside the retouche's scope: no drive-by refactor, no unrelated change. If you spot something worth fixing elsewhere, write it down for the final report instead of doing it.

**3. Mechanical gate.** `npm run lint`, `npm run format:check`, `npm run build` and `npm run test` all green, with no warning, no skipped or `.only` test, no new `eslint-disable`, no lowered threshold. Fix the cause, never silence the check.

**4. Code review, by a separate reviewer.** Spawn a fresh subagent (it has not seen your reasoning) and ask it to review `git diff main...HEAD` against CLAUDE.md and `docs/engineering-standards.md`, read-only. It must look for: SRP/DRY/KISS violations, duplicated logic, components doing too much, logic that belongs in a hook, import-boundary or typing shortcuts, French literals outside `strings.ts`, one-off values instead of tokens, missing logging on key steps, missing error-status handling, accessibility (labels, names of icon buttons, focus, 56/64 px touch targets, contrast), stale or missing tests, leftover dead code, and anything that contradicts the board. It returns findings ranked by severity with file and line. Also run the `code-review` skill on the branch. Fix every confirmed finding in new commits, then re-run the reviewer on the fix until it reports nothing of medium severity or above. Keep a short log of the findings and what you did with each (fixed, or not and why) for the PR.

**5. Visual review, by a separate reviewer.** Start the dev server (`preview_start`), then check every state on the checklist at 390, 768 and 1280 px in the browser pane, against the board read from the canvas: screenshots of the app next to the board for each. Check the layout (no overflow, no horizontal scroll, nothing clipped or overlapping, the bottom bar and keyboard-sensitive areas, touch-target sizes), the colours and type from the tokens, the focus order and visible focus ring, dark-on-yellow contrast, and the console and network for errors. Check the neighbouring screens that share the changed components (home, search/results, recipe, cooking, editor, account, login) for regressions, not only the retouched one. Then spawn a fresh subagent as visual reviewer: give it your screenshots and the board paths, and ask it for every difference, however small, ranked by severity. Fix, re-capture, re-review until no visible difference remains. A difference the board forces to be ambiguous is not a licence to improvise: choose the most conservative reading, document it, and list it in the PR.

**6. Manual-flow check.** Drive the real flows once in the browser pane (not only unit tests): for example for R1 open the overlay from each entry point, type, filter, validate, go back, close with each of the three ways; for R3 enter and leave writing mode with each exit and check the text is kept; for R5 go through all steps. Include a stale-token/401 pass where the screen calls the API.

**7. PR and merge.** Open the PR with: what changed and why, the board checklist (ticked), the code-review log, the visual-review notes with screenshots, the « à valider » points, and what differs from the board and why. Merge only when steps 3 to 6 are all clean on the final commit (re-run step 3 after the last fix). Then pull main, and start the next retouche from the fresh main.

## Test accounts

For the manual-flow and visual checks you may register test members through the API (`POST /auth/register`, or through the registration screen) when you need a signed-in user, and sign in with them. Rules:

- Only against the local back end (`http://localhost:8080`, started by me from my IDE). If it is not running, mock the API with MSW; never target another host.
- Throwaway values only: a clearly fake username and e-mail (for example `retouches-test-1`, on an `@example.test` address) and a generated password. Never reuse a real password or a real e-mail address of mine. Don't print the password in your replies, commits, PRs or logs; keep it in a git-ignored local file if you need it again.
- Members only (the `USER` role). Don't try to obtain `ADMIN`, and don't touch other people's data. The back has no account deletion, so reuse one or two test accounts instead of creating a new one per check, and list the ones you created in the final report so I can remove them.
- Recipes you create for testing get an obvious title prefix (« [test] ») and are deleted through the app when the check is done.

## Never wait for me

I will not be there. Run all five retouches to the end in one go, without asking me anything, and without stopping between retouches. Every question has a default:

- A board is ambiguous or contradicts another board, `CLAUDE.md` or the API contract: take the most conservative reading (the one that changes the least, invents no data and keeps the existing behaviour), document it in `docs/` and in the PR, and continue. The newest board wins over an older one; the API contract wins over any board.
- A board needs a back-end change or data the API does not have: build everything else, leave that part out, and list it for the final report.
- A reviewer finding or a visual difference is still open after three fix-and-review rounds: fix it differently (simplify, or go back to the board's literal reading) for up to three more rounds. If it is still open, and it is not a defect that breaks the screen, merge with the remaining item listed in the PR and the final report; if it breaks the screen or fails a gate, do not merge that retouche: leave its PR open and unmerged, with a clear note, and carry on with the next retouche that does not depend on it.
- Checks stay red: find the cause, never weaken a check. If you really cannot get a gate green, treat it like the case above: the retouche stays unmerged.
- You are about to delete or rewrite something outside the retouche's scope: don't; note it for the final report.

Never merge a red or unreviewed branch to keep moving, and never skip a gate to save time. Being autonomous means the process above runs without me, not that it is shortened.

When all five are done (merged, or left open with a note), do a last pass on main: pull, run the four checks, and click through the whole app once at 390, 768 and 1280 px (home, search overlay and results, recipe, cooking, editor with writing mode, account, login, 404, an empty state) looking for regressions between retouches. Fix what you find through the same process.

## Per retouche

**R5 · cooking step, mobile only.** Remove the « ÉTAPE n » stamp on mobile; the text and photos move up, nothing else changes. Tablet and desktop keep the stamp. Check the six states drawn (no photo, one photo, several, first, last, very long step).

**R2 · logo.** Replace the logo with the redrawn cocotte (lid open at 18°, three thin steam lines, thin highlights, real mouth) in all four formats: large logo with the name, horizontal lockup, compact mark, favicon/app icon. Follow the board's table of what each size keeps and drops. Update `Logo`, the favicon (`favicon.svg`, `.ico`), the apple-touch-icon and the 192/512 icons. Keep accessible names and the existing `Logo` API unless the board forces a change.

**R4 · mascot and logo in situ.** Build the mascot « Mijotine » as a component with its seven moods (contente, dépitée, coup de cœur, surprise, perdue, endormie, en fête) and four sizes, details dropped at small sizes as drawn. Put the right mood in the situations of `Retouche-4-situations` that exist in the app today (empty states, error and 404 pages, offline/slow loading, recipe saved, first recipe, login, empty « Mes recettes », cooking timer end if there is a timer). Apply the logo placements of `Retouche-4-logo-en-situation`. The mascot is decorative: `aria-hidden` unless it carries meaning. **Do not invent features**: the boards mention favourites and the like in some captions; the API has none (see CLAUDE.md), so leave those words out and tell me which captions you skipped. Replace `BowlIllustration` where the mascot replaces it, and delete it if unused.

**R3 · rich text.** Three new tools (text size, underline, strikethrough), the toolbar on a single scrolling line with the order and « > » hint drawn, and the writing mode: full-screen on mobile (tap the field; « Terminé », back arrow or the device back gesture all keep the text and return to the same field, scrolled, with a short « … mise à jour » message) and optional on tablet and desktop (« Écrire en plein écran » button, Ctrl/Cmd + Maj + F; leave with « Terminé », Échap or a click on the backdrop). This **extends the minimal toolbar written in CLAUDE.md**, so decide and document in `docs/` how size, underline and strikethrough are stored in the HTML (it must survive the back unsanitised, the DOMPurify allow-list in `RichTextView`, and keep older recipes rendering unchanged), update the Rich text section of CLAUDE.md, and extend the DOMPurify tests with the new tags/attributes and with hostile input. Petit/Normal/Grand in the intro and tip, only Petit/Normal in a step, as drawn. Keep Lexical pinned. Add the three icons in the existing icon style. Writing mode must also solve the old bug-list item that the toolbar sits above the « Annuler / Enregistrer » bar (see `docs/bugs-prompt.md`): in writing mode that bar is gone.

**R1 · search as an overlay.** The largest one; read all four boards twice.
- Search buttons (home search bar, mobile « Rechercher » tab, the top-bar field on tablet and desktop, the field and « Filtres » on the results page) open a search overlay instead of navigating to a page: bottom sheet on mobile (existing sheet component), centred panel on tablet, panel under the top bar on desktop (two columns, no section pills). It carries the title field and all the filters of the old filter sheet (category tree, tags, ingredients, author), keeping the same state and URL parameters model as today.
- « Rechercher » replaces « Voir les N recettes »; it and the keyboard key are disabled until there is a word or a filter. Pressing the button validates and goes to the results page; no button ever leads to an unfiltered list. The category tiles of the home page and « Mes recettes » go straight to results with their filter (« Mes recettes » overlay has no « Auteur » field).
- The results page loses its entry state, « Pendant la saisie » and « toutes les recettes »; with no criteria it shows the « aucun critère » invitation instead. Removing a chip or clearing the word refreshes the results in place. Sorting stays on the results page; the desktop filter column stays as is.
- Tablet: remove the « Rechercher » tab (2 tabs for visitors, 3 for members) and add the tablet header (logo and field) on every page, as drawn. Desktop: remove the « Rechercher » link, keep the field; the first character typed is carried into the overlay.
- Close with the cross, Échap or a click on the backdrop; « Réinitialiser » clears without closing; filters failing to load shows the brick message with « Réessayer » and word search still works. Device back from the results returns to the page before the search was opened. Focus is trapped and restored (Radix), the page behind does not move.
- Several details on the boards are marked « à valider » (no live count, the tablet header, the removed desktop link, the desktop layout). Build them as drawn and list them in the PR so I can confirm.

## When done

Only now, once everything is done, write me one report (also saved as `docs/retouches-report.md`). Per retouche: the PR, what differs from the board and why, the « à valider » points, the review findings that were fixed and the ones that were not (with why), any caption or feature left out because the API has none, the out-of-scope problems you noticed, and any follow-up worth its own task. Do not paste the boards into the docs; link them.
