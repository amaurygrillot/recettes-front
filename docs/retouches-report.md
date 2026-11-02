# Retouches report (partial: R5, R2, R4 and R3 are merged, R1 is not built)

The session stopped on a usage limit while R1 was being planned. Everything below is true of `main` as of the merge of PR 17. The boards are linked from
[design-boards.md](design-boards.md#retouches), not copied.

## R5 · cooking step without the stamp: [PR 14](https://github.com/amaurygrillot/recettes-front/pull/14), merged

- **Differs from the board**: nothing intended. The board's fourth « ce qui change » (a 32 px « ÉTAPE 3 » pill, « si tu préfères le garder ») is an alternative, not built.
- **Review findings**: all low, fixed (`showStamp` naming, tests as one table plus a live-resize test, docs wording). The visual review found the swipe hint floating under a short instruction: fixed.
- **Out of scope noticed**: none.

## R2 · the cocotte logo: [PR 15](https://github.com/amaurygrillot/recettes-front/pull/15), merged

- **Differs from the board**: `Logo` variants renamed `large | lockup | mark` (the old names no longer described anything). The large logo now holds its name, so in `AuthFrame` the same box holds cocotte and name. `favicon.ico` (16, 32) and `apple-touch-icon.png` (180) were rasterized from the SVG in the browser (no image tooling in the project).
- **À valider**: the **192 and 512 px icons are not made**: the repository has no web app manifest, so nothing would use them, and a manifest would make the site installable, which no board asks for.
- **Review findings**: low ones fixed; not fixed, with reason: the three tone strings repeat the same variables (Tailwind must see each class whole), the geometry split between `Logo.tsx` and `logoShapes.tsx`.

## R4 · Mijotine and the logo in situation: [PR 16](https://github.com/amaurygrillot/recettes-front/pull/16), merged

- **Done**: `Mascot` (7 moods, 4 sizes), `NoPhoto`, the sleeping mascot for no connection, the celebration dialog after a created recipe, the happy mascot on the sign-in, logo placements (desktop lockup 52 px, compact mark under 360 px, 190 px cocotte on entry pages). `BowlIllustration` deleted.
- **Captions and features left out because the API has none**: « coup de cœur » stamp (no favourites), « la mettre en favori » of the published dialog, the timer-end situation and the *surprised* mood's use (no timer), the sleeping mascot for a very long loading (no slow-loading state).
- **Differs from the board**: no yellow « Pas de connexion » banner and the board's offline text not used (it promises an automatic wake-up and kept drafts, false for a « Réessayer » page); no « Effacer la recherche » button (the search screen is redone by R1); registration and forgotten password keep a 160 px logo (the « Retour » pill would cover the steam of a larger one).
- **À valider**: the sign-in shows the mascot and « Qu’est-ce qu’on mijote aujourd’hui ? » instead of the application's name; the celebration opens only for a creation, with no « first recipe » distinction.
- **Review findings**: mascot on the yellow band (fixed: `on-butter` tone), clipped « Pas encore de photo » caption (fixed), back navigation replayed the celebration (fixed), editor load failure without the sleeping mascot (fixed). Not fixed: 44 px logo link under the 56 px minimum (as before).

## R3 · rich text: [PR 17](https://github.com/amaurygrillot/recettes-front/pull/17), merged

- **Storage decision** (also in `CLAUDE.md`): `<u>`, `<s>`, `<small>` (Petit), `<big>` (Grand), no attribute; DOMPurify allow-list grows by those four tags; old recipes untouched; a size rides on Lexical's subscript/superscript formats inside the editor.
- **Differs from the board**: writing-mode text uses the tokens (18/28, 22/34), not the board's 20/32; no « Brouillon enregistré » indicator in the strip; the tablet strip has no back arrow (the board draws none).
- **À valider**: a tap on the text opens the mode on a phone and keyboard focus alone does not; a pasted `<sub>`/`<sup>` becomes Petit/Grand.
- **Review findings fixed**: the caret stayed on the page behind when the mode opened (high, confirmed in the browser), Petit/Grand shifted by the browser's `sub`/`sup` styles, underline plus strikethrough drew one line, « Normal » did nothing on a mixed selection, the writing mode's margins and strip against the board. Not fixed: tools stay enabled while the field is locked (as before).
- **Not verified in the browser**: the real recipe-editor screen (it needs a signed-in member; see « Test account »). It is covered by its tests (the « … mise à jour » notification for the three fields, the leave guard with a modified form).

## R1 · the search as an overlay: NOT built

- Only the decisions are written and committed on branch `feat/retouche-1-search-overlay` (not pushed, no PR): [design-boards.md, section R1](design-boards.md#r1--the-search-opens-as-an-overlay-retouche-1-principe--mobile--grands-ecrans--resultats).
- **Plan found while reading the code** (to start from): one overlay owned by the shell (`app/SearchOverlayProvider` + `useSearchOverlay`, the container inside `screens/SearchScreen`, which `app` may import); the filter blocks (`FiltersPanel`, `SectionPills`, `useFilterOptions`) stay where they are and are reused; `BottomSheet` gets an `initialFocusRef`; `SearchPill` gets an `inputRef`; a new `SearchLauncher` (a button that looks like the field) serves the home bar, the top bar, the tablet header and the results page; `TabBar` needs an action item for « Rechercher » (phone only); the tablet loses the tab and gets a header on every page but the home page; the desktop loses the link; the results page loses its entry state, `SearchField`, `FiltersControl`, `useSearchText`, `useRecipeCount` and the « toutes les recettes » caption, and gains the « aucun critère » invitation; `useRecipeFeed` needs an `enabled` option; `SearchScreen.test.tsx` (800 lines), `HeaderSearch`, `TabBar`, `AppShell`, `HomeHeader` and router tests must be rewritten.
- **Left out by design**: the ingredient filter (the API's `GET /recipes` still has no ingredient criterion).

## Out-of-scope problems noticed

- `docs/retouches-prompt.md` (your untracked file) was **committed into `main`** by an over-broad `git add docs` in commit `c7f1531` (R5). Remove it from the repository if you did not want it there.
- `HeaderSearch.test.tsx` failed once under load, then passed on every rerun: a timing-sensitive test.
- `npm run build` prints a « chunks larger than 500 kB » notice (already there before the retouches).
- Your dev server on port 5173 keeps stale transformed modules after rapid in-place edits (`touch` the file to refresh); `preview_start` by name cannot start a second one on the fixed port.

## Test account (to remove)

`retouches-test-1` (e-mail `retouches-test-1@example.test`) was registered on the local back end (it has no account deletion). Its password is only in a scratchpad file outside the repository. No test recipe was created.
