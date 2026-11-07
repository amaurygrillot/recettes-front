# Retouches report: R5, R2, R4, R3 and R1, all merged

The five retouches of the « Retouches » page of the canvas ([boards](design-boards.md#retouches), not copied here) are built and merged, one branch and one PR each, in the order asked: R5, R2, R4, R3, R1. Every PR went through the four checks (`lint`, `format:check`, `build`, `test`), a code review by a fresh read-only agent plus the `code-review` skill, a visual review by another fresh agent at 390 / 768 / 1280 px, and a manual pass in the browser. `main` after the merge of PR 18: **lint, format, build and 1894 tests are green**.

## R5 · cooking step without the stamp: [PR 14](https://github.com/amaurygrillot/recettes-front/pull/14)

- **Differs from the board**: nothing intended. The board's fourth « ce qui change » (a 32 px « ÉTAPE 3 » pill, « si tu préfères le garder ») is an alternative, not built.
- **Review findings**: all low, fixed (`showStamp` naming, tests as one table plus a live-resize test, docs wording). The visual review found the swipe hint floating under a short instruction: fixed.

## R2 · the cocotte logo: [PR 15](https://github.com/amaurygrillot/recettes-front/pull/15)

- **Differs from the board**: `Logo` variants renamed `large | lockup | mark` (the old names no longer described anything). The large logo now holds its name, so in `AuthFrame` the same box holds cocotte and name. `favicon.ico` (16, 32) and `apple-touch-icon.png` (180) were rasterized from the SVG in the browser (no image tooling in the project).
- **À valider**: the **192 and 512 px icons are not made**: the repository has no web app manifest, so nothing would use them, and a manifest would make the site installable, which no board asks for.
- **Review findings**: low ones fixed. Not fixed, with reason: the three tone strings repeat the same variables (Tailwind must see each class whole), the geometry split between `Logo.tsx` and `logoShapes.tsx`.

## R4 · Mijotine and the logo in situation: [PR 16](https://github.com/amaurygrillot/recettes-front/pull/16)

- **Done**: `Mascot` (7 moods, 4 sizes), `NoPhoto`, the sleeping mascot for no connection, the celebration dialog after a created recipe, the happy mascot on the sign-in, logo placements (desktop lockup 52 px, compact mark under 360 px, 190 px cocotte on entry pages). `BowlIllustration` deleted.
- **Captions and features left out because the API has none**: « coup de cœur » stamp (no favourites), « la mettre en favori » of the published dialog, the timer-end situation and the *surprised* mood's use (no timer), the sleeping mascot for a very long loading (no slow-loading state).
- **Differs from the board**: no yellow « Pas de connexion » banner and the board's offline text not used (it promises an automatic wake-up and kept drafts, false for a « Réessayer » page); registration and forgotten password keep a 160 px logo (the « Retour » pill would cover the steam of a larger one). The « Effacer la recherche » of the search board was done in R1.
- **À valider**: the sign-in shows the mascot and « Qu’est-ce qu’on mijote aujourd’hui ? » instead of the application's name; the celebration opens only for a creation, with no « first recipe » distinction.
- **Review findings fixed**: mascot on the yellow band (`on-butter` tone), clipped « Pas encore de photo » caption, back navigation replayed the celebration, editor load failure without the sleeping mascot. Not fixed: 44 px logo link under the 56 px minimum (as before).

## R3 · rich text: [PR 17](https://github.com/amaurygrillot/recettes-front/pull/17)

- **Storage decision** (also in `CLAUDE.md`): `<u>`, `<s>`, `<small>` (Petit), `<big>` (Grand), no attribute; the DOMPurify allow-list grows by those four tags; old recipes untouched; inside the editor a size rides on Lexical's subscript/superscript formats.
- **Differs from the board**: writing-mode text uses the tokens (18/28, 22/34), not the board's 20/32; no « Brouillon enregistré » indicator in the strip; the tablet strip has no back arrow (the board draws none).
- **À valider**: a tap on the text opens the mode on a phone and keyboard focus alone does not; a pasted `<sub>`/`<sup>` becomes Petit/Grand.
- **Review findings fixed**: the caret stayed on the page behind when the mode opened (high, confirmed in the browser), Petit/Grand shifted by the browser's `sub`/`sup` styles, underline plus strikethrough drew one line, « Normal » did nothing on a mixed selection, the writing mode's margins and strip against the board. Not fixed: tools stay enabled while the field is locked (as before).
- **Not verified in the browser**: the real recipe-editor screen (it needs a signed-in member; see « Test account »). It is covered by its tests.

## R1 · the search as an overlay: [PR 18](https://github.com/amaurygrillot/recettes-front/pull/18)

- **Done**: every search entry point opens one overlay owned by the app (`SearchOverlayProvider` in `RootLayout`, `useSearchOverlay()`): a bottom sheet on a phone and a tablet, a panel under the top bar on a desktop. It works on a draft and writes the address (same URL model as before) only when « Rechercher » is pressed; that button is disabled until there is a word or a filter. The results page only reopens it; with nothing to search for it shows « Que veux-tu cuisiner ? » and asks the API for nothing. The phone has a « Rechercher » tab that opens it, the tablet a header with the field, the desktop bar a field instead of a link.
- **Differs from the board**: no ingredient filter (the API has no ingredient criterion; same for several categories or tags: the API takes one of each); no live count (« Voir les N recettes » asked a request per choice); desktop bar field 56 px instead of 52; the one-to-1.7 proportion of the two sheet buttons and the icon of « Rechercher » are not drawn.
- **À valider**: the missing live count; the tablet header (not sticky, a little wider than the page content); the removed desktop « Rechercher » link; the two-column desktop panel; a key typed on the field of a results page is added after the word already there; the invitation's button is called « Lancer une recherche »; on a scrolled desktop page the non-sticky bar leaves a strip of undimmed page above the panel.
- **Back links changed on purpose**: « Retour aux recettes », « Voir les recettes », the way back of a recipe opened first and the end of a deletion now lead to the **home page** (the feed), because `/rechercher` is never a list of everything any more.
- **Review findings fixed**: six links still pushed the bare, now empty, `/rechercher`; spaces counted as a criterion and listed the whole library; the overlay could stay open over another page after the device's back; Escape in a category field closed everything; focus return lost when crossing 1024 px; the desktop panel was cut on short windows; section pills for sections not shown; AltGr keys lost; caret effect running too early; double clear cross (native `type=search` button); the sheet shifted 9 px when a pill was touched; phone sheet at 85 % instead of nearly full height; tablet panel 680 → 600 px; desktop panel full width with a title → 800 px, field first; a very long word overflowing the empty-state card; **the buttons of every bottom sheet touching its edges** (`pb-safe-bar` overwrote `px-5`, an old defect).
- **Review findings not fixed**: focus falls to the page after a validated search (the opener is gone); duplicate section ids when the desktop column and the panel are both in the DOM (the page behind is inert); Option-composed characters on macOS are not carried by the field; scope rule (`pathname === /mes-recettes`) lives in both the provider and the router; ring on the bar field while the panel is open; pills row overflowing by 14 px with a badge; the active pill after a jump on a tablet.
- **Not re-reviewed by a second agent**: the fixes were verified by tests (+ the new ones) and in the browser, not by a second round of fresh reviewers.

## Final pass on `main`

Pulled `main`, ran the four checks (green). Walked the app at 390, 768 and 1280 px in the browser as a visitor: home, search overlay and results (with criteria, with none, no result), a recipe, cooking mode, login (including the redirects of `/compte` and `/recettes/nouvelle`), the 404, an empty state: no horizontal overflow, the right bars (2 tabs on a tablet, no « Rechercher » link on a desktop), the tablet header only on the pages that have none. **Not clicked through**: account, the recipe editor with its writing mode and « Mes recettes » for a signed-in member (the token of the test account could not be read, see below); they are covered by their tests and by the earlier retouches' checks. Nothing needed fixing.

## Captions and features left out because the API lacks them

« Coup de cœur » stamp and « mettre en favori » (no favourites); timer-end situation (no timer); sleeping mascot for a very long loading (no slow-loading state); ingredient filter, several categories or tags, live result count (R1).

## Out-of-scope problems noticed (not fixed)

- `docs/retouches-prompt.md` (your untracked file) was **committed into `main`** by an over-broad `git add docs` in commit `c7f1531` (R5). Remove it from the repository if you did not want it there.
- `src/api/unwrap.ts` logs every cancelled request (`AbortError`, navigating or unmounting) at **error** level: about 80 lines in the console during quick navigation. Probably `debug`.
- `appName` in `src/app/strings.ts` is not used anywhere.
- `npm run build` prints a « chunks larger than 500 kB » notice (already there before the retouches).
- Your dev server on port 5173 keeps stale transformed modules after rapid in-place edits (touching the file refreshes it); `preview_start` by name cannot start a second one on the fixed port.
- Section pills on the sheet overflow the row by a few pixels when a count badge shows.

## Follow-ups

- Decide whether the tablet header should be sticky (without the tab, searching needs a scroll back to the top).
- Move the focus to the results' heading after a validated search.
- ~~Ingredient filter: needs an `ingredient` criterion on `GET /recipes` in the back end.~~ Done in the second round below.
- Log `AbortError` below error level.

## Second round: R5 extended, R6, R7, R8 and the ingredient filter

The canvas changed after the first round (new boards R5.2 to R5.4, R6, R7.1 to R7.4 and R8), and the ingredient search the R1 boards draw was still
missing. Nothing of this round is committed yet (see the branches offered at the end of the session). Decisions are in
[design-boards.md](design-boards.md) (R5, [the ingredient filter](design-boards.md#the-ingredient-filter-retouche-1-follow-up), R6, R7, R8).

- **R5, extended**: the « ÉTAPE n » stamp is gone **on every screen**, not only on a phone (`StepContent` lost `showStamp`, `StepNumber` its `word`
  variant, the strings their `stamp`). The reading column, the panel and the footer are unchanged.
- **R6**: the `list-number` icon is the board's new drawing (taller digits at a thinner stroke).
- **R7**: no drag handle in the editor, on the photos, the steps and the ingredient lines. `SortableList`, `GripButton` and the drag strings are deleted,
  **dnd-kit is removed from `package.json`**, the lists are a plain `ItemList` / `Item`; the arrows' buttons, announcements and focus-following stay.
- **R8**: a card with several photos is a small slider (dots, counter « 1 / 3 », a drag that follows the finger, arrows and ← → on a desktop). A tap anywhere
  still opens the recipe.
- **Ingredient filter**: the « Ingrédients » block of the search (field with suggestions asked of the back end, chips, « Recettes avec tous ces
  ingrédients. », pill with its count), in the overlay and in the desktop column, `&ingredient=<id>` in the address (repeated).
- **The back end (`recettes-back`) was changed, which the first round had ruled out**, because both the filter and the slider need data the API did not
  give: `GET /recipes` takes `ingredientIds` (every one required, twenty at most, one row per recipe) and the summary lists `coverMediaIds`. Changed there:
  `RecipeSearchRequest`, `RecipesRepository.searchIds`, `RecipeService`, `RecipeMapper`, `RecipeSummaryResponse`, `RecipeMcpTools`, `openapi.yaml`,
  `docs/recipes-domain-model.md`, `recipes.http`, and the tests (`RecipesRepositoryTest`, `RecipeServiceTest`, `RecipeMapperTest`,
  `RecipesIntegrationTest`). The tests that were run against the development database pass (the new ones and the contract tests). Restart the back end from
  the IDE to use them: until then the front falls back to the first photo of a card and the filter has no effect on the list.
- **Checked**: lint, format and the 1936 front tests; in the browser against the modified back end (on another port, since stopped) the cards with two photos
  show « 1 / 2 », a touch drag moves and settles, the search finds « Riz arborio » by typing, chooses it, validates to
  `/rechercher?ingredient=<id>` with its chip and the one recipe that uses it; the cooking step has no stamp at 768 px. **Not checked in the browser**: the
  editor without handles (it needs a signed-in member), the card arrows on hover, and a real finger on a phone.
- **À valider**: all the ingredients are required (AND), as the board's sentence says; the arrows of a card show on the card's hover, not only the photo's;
  the `coverMediaId` field is kept next to `coverMediaIds` (redundant, but nothing that reads it breaks); the `grip` icon stays in the icon set unused.
- **Out of scope, noticed**: `RecipesRepositoryTest.filtersByTitleFragment_caseInsensitively` failed on the development database (real recipes have « pommes »
  in their title); it now searches a fragment of its own.

## Test account (to remove)

`retouches-test-1` (e-mail `retouches-test-1@example.test`) was registered on the local back end (it has no account deletion). Its password is only in a scratchpad file outside the repository. No test recipe was created, and no other account.
