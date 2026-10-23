# Design boards by screen

Where each screen is designed in the Claude Design canvas https://claude.ai/artifact/F1LCSxWHJTzDJ2qaT9Jxm9. List its
files, read `project/canvas.json`, then read only the boards you need with `path: project/<file>`. The extracted design
values are in [design-tokens.md](design-tokens.md); the canvas remains the source of truth.

| Screen | Boards (files under `project/`) |
|---|---|
| Foundations | `Main` (colors) · `Typographie` · `Fondations` · `Boutons-champs` · `Champs-avances` · `Grille` · `Icones` |
| Shell and components | `Navigation` · `Bouton-flottant-feuille` · `Retours-chargement` · `Avatar-voir-plus` · `Carte-navigation` · `Logo-bol` · `Marque-ecrans` |
| HomeScreen | `Accueil-mobile` · `Accueil-etats` · `Carte-accueil` · `Accueil-tablette` · `Accueil-ordinateur` |
| SearchScreen | `Rechercher-entrees` · `Rechercher-filtres` · `Rechercher-etats` · `Rechercher-mes-recettes` · `Rechercher-tablette` · `Rechercher-ordinateur` |
| RecipeScreen | `Fiche-haut` · `Fiche-corps` · `Fiche-audiences` · `Fiche-etats` · `Fiche-grands-ecrans` |
| CookingScreen | `Pas-a-pas-entree` · `Pas-a-pas-etape` · `Pas-a-pas-fin` · `Pas-a-pas-etats` · `Pas-a-pas-grands-ecrans` |
| RecipeEditorScreen | `Editeur-cadre` · `Editeur-texte-riche` · `Editeur-categories-tags` · `Editeur-photos` · `Editeur-ingredients` · `Editeur-etapes-conseil` · `Editeur-validation` · `Editeur-session-droits` · `Editeur-grands-ecrans` |
| Auth and account | Added to the canvas after this table was written: find the registration, forgot-password, reset-password and account boards in `canvas.json`, then list them here. |

The boards contain sample data (recipe names, « 35 min · 4 personnes · facile ») that the API cannot provide. Treat it as
illustration, never as a requirement.

## The shell (M4)

Built from `Navigation`, `Bouton-flottant-feuille` and `Grille` (phone bar 106 px = 2 + 8 + 76 + 20, tabs of 76 px, yellow pill
for the current page, round « + » of 64 px 16 px above the bar and 16 px from the right edge, top bar from 1024 px, margins 16 / 32 /
64 px with the content at 1152 px). Checked in the browser at 390, 768 and 1280 px. Decisions to know before building M5:

- **The boards disagree about the desktop bar. Settled in M5: the home boards win.** `Navigation` (the earliest board) draws it
  84 px tall, tabs on the left, a « Nouvelle recette » button in the bar. `Accueil-ordinateur`, `Rechercher-ordinateur`,
  `Fiche-grands-ecrans` and `Compte-grands-ecrans` agree on another bar: 88 px, logo left, tabs **centered**, a 290 px **search
  field**, the account tab with the member's **avatar**, and « + Nouvelle recette » **in the page header** instead of in the bar.
  M5 follows them: `TopBar` has no create button any more. **Until each screen is built, a member on a desktop has no create
  button on the pages still showing a placeholder** (the home page has it, beside the feed title); each screen adds its own as
  its board draws it (« Mes recettes » has it in the list header). The field is a real search form (`HeaderSearch`): Enter opens
  `/rechercher?q=…`; on the two searching pages it is their field (see SearchScreen below).
- **The « + » is named « Nouvelle recette », round or extended.** The `Bouton-flottant-feuille` board says « Créer une recette »,
  the home board « Nouvelle recette »; a visible label has to be part of the accessible name, and a name that changed as the page
  scrolled would be confusing, so there is one string (`navigation.newRecipe`). The extended form is the home screen's: it
  shows its label at the top of the feed, shrinks to the round « + » while the reader goes down and comes back going up
  (`useScrolledDown`), and is hidden when the feed is empty for a member (the empty state has its own « Créer une recette »).
  A page asks the shell for that with `useCreateButtonMode('extends-at-top' | 'hidden')` (default `round`).
- **The login board asks for an « Adresse e-mail », the API logs in by `username`** (`DatabaseUserDetailsService` finds by
  username only). The stand-in LoginScreen asks for « Nom d'utilisateur ». **Settled with the user (2026-10-23): stay on the username for
  now.** The board's label has to follow (or the back end has to accept an e-mail) when the auth screens are built.
- **The search page's URL contract** (`searchPath` in `app/paths.ts`): `/rechercher?categorie=<id>` opens with that category
  chosen (home tiles), `/rechercher?q=<text>` with that text in the title search (the bar's field). The fake search field on the
  phone and tablet opens plain `/rechercher`, where the field has the focus. SearchScreen reads these (and `exacte`, `tag`, `auteur`, `tri`, see below).
- **Full-screen screens** (no tab bar): login and the other public auth screens, cooking mode, the recipe editor.
- The session-expired dialog text is the board's, minus « Ton brouillon est conservé »: no draft exists before the editor does.
- The filter bottom sheet of `Bouton-flottant-feuille` belongs to SearchScreen, not to the shell.

## HomeScreen (M5)

Built from `Accueil-mobile`, `Accueil-etats`, `Carte-accueil`, `Accueil-tablette` and `Accueil-ordinateur`, checked at 390,
768 and 1280 px (metrics read from the page against the boards' values: margins, gaps, tile and card sizes, type, bar heights).

- **Data**: `GET /recipes` (20 per page, `sortBy=CREATED_AT`, `direction=DESC`, infinite query) and `GET /categories`, keeping
  the `MAIN` ones. No rating, time, difficulty, favorite or sharing: the card shows the photo, up to two categories, the title,
  up to three tags (« +N » for the others), the author's username and « il y a … ». Order of the tiles is the API's (by name),
  not the design's Entrées / Plats / Desserts order. A tile's icon comes from its name (`categoryIcon`), the cutlery otherwise.
- **« Toutes »** is the tile for what the page shows (every recipe): current, and a link to the home page.
- **Order of blocks**: the DOM follows the desktop's reading order (title, tiles, feed); on a phone and tablet CSS `order` puts
  the tiles above the title, as drawn.
- **States**: loading (skeletons after 300 ms, each block announced once), network error (the board's text) and every other
  failure with the sentence of its cause (`failureMessage`), empty for a visitor (« Actualiser ») and for a member who may
  write (« Créer une recette », the shell's « + » hidden), « Voir plus de recettes » with its counter, busy button (it keeps the
  focus), failure banner with retry, and « Tu as tout vu : N recettes. » (focus moves there). Failing categories degrade to
  « Toutes » alone: they are a shortcut, not a gate. No endless scrolling, as the board asks.
- **A recipe listed twice** (a new one pushes it onto the next page) is shown once.
- **Cards in a row have the same height**, the extra space at the bottom of the shorter ones (the board reserves 60 px for the
  title for the same purpose).
- **Compact state blocks**: the home states board draws the empty and error blocks smaller than `Retours-chargement`
  (140 px bowl, 64 px badge, tighter padding): `size="compact"` on `EmptyState`, `ErrorState` and `BowlIllustration`.
- **Dev database**: the local database holds 51 leftover test categories (`dessert-…`, `gouter-…`), so the real home page shows
  a long row of tiles. They are data, not a bug; the front shows every `MAIN` category.

## SearchScreen (`/rechercher` and `/mes-recettes`)

Built from `Rechercher-entrees`, `-filtres`, `-etats`, `-mes-recettes`, `-tablette` and `-ordinateur`. **The URL is the state**:
`?q=` (title text, 200 characters at most) `&categorie=<id>` `&exacte=1` (only that category) `&tag=<id>` `&auteur=<text>`
`&tri=recentes|modifiees|titre-az|titre-za`; only what differs from the default is written (`app/searchCriteria.ts`). Changes replace
the history entry, so « back » returns to where the reader came from. Typing searches after a 300 ms pause (or Enter); the same text
is typed in the page's field (phone, tablet) or in the bar's (desktop).

**Where the boards ask for more than the API gives** (decided, not asked: the board itself says so on `Rechercher-filtres`):

- **No ingredient filter** (`GET /recipes` has no such criterion): the « Ingrédients » section, chip and sentence are not built.
- **One category and one tag at a time** (the API takes a single `categoryId` and `tagId`): the category tree uses radio buttons
  with « Toutes les catégories » to choose none; tags are chips of which one is pressed. A category includes what is filed
  beneath it, which is the API's default; « Uniquement cette catégorie » (a checkbox under the chosen parent) asks for
  `includeSubcategories=false`. The badge of a section is therefore 0 or 1. **What the back end would need** for the boards as drawn: a
  list of category ids and of tag ids (with an AND/OR rule) and an ingredient criterion.
- « Les plus utilisés »: the API has no usage count, so the tags are all shown (chosen first) and the field narrows them.

Other decisions: filters on a phone and a tablet are a `BottomSheet` working on a **draft** (« Voir les N recettes », N from a page of
one, applies it; closing drops it; « Réinitialiser » clears the draft), centered from 600 px; on a desktop a 270 px column applies each
choice at once. The sheet's handle is a button (it closes; there is no drag). The sort is a sheet of radio buttons on a phone and the
browser's own list on a desktop. Section pills jump to their section and follow the scroll. The suggestions of the category and tag
fields are a `Combobox` (start of word, accents and case ignored, five at most, nothing created). While a new answer comes, the
previous one stays with « Recherche… » in the count line. « Mes recettes »: author fixed to the member by id (an `auteur` in the URL
is ignored), locked chip not counted among the filters, « + » extended at the top of the list and hidden for a first recipe.
