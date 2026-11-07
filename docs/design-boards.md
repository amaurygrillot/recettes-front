# Design boards by screen

Where each screen is designed in the Claude Design canvas https://claude.ai/artifact/F1LCSxWHJTzDJ2qaT9Jxm9. List its
files, read `project/canvas.json`, then read only the boards you need with `path: project/<file>`. The extracted design
values are in [design-tokens.md](design-tokens.md); the canvas remains the source of truth.

| Screen | Boards (files under `project/`) |
|---|---|
| Foundations | `Main` (colors) · `Typographie` · `Fondations` · `Boutons-champs` · `Champs-avances` · `Grille` · `Icones` |
| Shell and components | `Navigation` · `Bouton-flottant-feuille` · `Retours-chargement` · `Avatar-voir-plus` · `Carte-navigation` · `Logo-bol` (replaced by R2) · `Marque-ecrans` |
| HomeScreen | `Accueil-mobile` · `Accueil-etats` · `Carte-accueil` · `Accueil-tablette` · `Accueil-ordinateur` |
| SearchScreen | `Rechercher-entrees` · `Rechercher-filtres` · `Rechercher-etats` · `Rechercher-mes-recettes` · `Rechercher-tablette` · `Rechercher-ordinateur` |
| RecipeScreen | `Fiche-haut` · `Fiche-corps` · `Fiche-audiences` · `Fiche-etats` · `Fiche-grands-ecrans` |
| CookingScreen | `Pas-a-pas-entree` · `Pas-a-pas-etape` · `Pas-a-pas-fin` · `Pas-a-pas-etats` · `Pas-a-pas-grands-ecrans` |
| RecipeEditorScreen | `Editeur-cadre` · `Editeur-texte-riche` · `Editeur-categories-tags` · `Editeur-photos` · `Editeur-ingredients` · `Editeur-etapes-conseil` · `Editeur-validation` · `Editeur-session-droits` · `Editeur-grands-ecrans` |
| Auth screens | `Marque-ecrans` (sign-in) · `Compte-inscription` · `Compte-mot-de-passe-oublie` · `Compte-nouveau-mot-de-passe` · `Compte-public-grands-ecrans` |
| AccountScreen | `Compte-page` · `Compte-etats` · `Compte-grands-ecrans` |
| Retouches (the canvas page « Retouches ») | R1 `Retouche-1-principe` · `Retouche-1-mobile` · `Retouche-1-grands-ecrans` · `Retouche-1-resultats`; R2 `Retouche-2-cocotte`; R3 `Retouche-3-texte-riche-mobile` · `Retouche-3-texte-riche-grands-ecrans`; R4 `Retouche-4-mascotte` · `Retouche-4-situations` · `Retouche-4-logo-en-situation`; R5 `Retouche-5-etape-sans-badge` · `Retouche-5-fin-sans-badge` · `Retouche-5-etats-sans-badge` · `Retouche-5-grands-ecrans-sans-badge`; R6 `Retouche-6-icone-liste`; R7 `Retouche-7-photos` · `Retouche-7-ingredients` · `Retouche-7-etapes` · `Retouche-7-grands-ecrans`; R8 `Retouche-8-miniatures-slider` |

The **Retouches** boards are design changes applied on top of the screens above; where they name an older board (« ce qui change »),
the newer board wins, and the older one is marked with « replaced by R… » as each retouche is built (see [Retouches](#retouches)).

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
  button on the pages that do not have one yet** (the home page has it, beside the feed title); each screen adds its own as
  its board draws it (« Mes recettes » has it in the list header). The field is a button that opens the search over the
  page (R1 below); on the two results pages it shows the word searched.
- **The « + » is named « Nouvelle recette », round or extended.** The `Bouton-flottant-feuille` board says « Créer une recette »,
  the home board « Nouvelle recette »; a visible label has to be part of the accessible name, and a name that changed as the page
  scrolled would be confusing, so there is one string (`navigation.newRecipe`). The extended form is the home screen's: it
  shows its label at the top of the feed, shrinks to the round « + » while the reader goes down and comes back going up
  (`useScrolledDown`), and is hidden when the feed is empty for a member (the empty state has its own « Créer une recette »).
  A page asks the shell for that with `useCreateButtonMode('extends-at-top' | 'hidden')` (default `round`).
- **The login board asks for an « Adresse e-mail », the API logs in by `username`** (`DatabaseUserDetailsService` finds by
  username only). The stand-in LoginScreen asks for « Nom d'utilisateur ». **Settled with the user (2026-10-23): stay on the username for
  now.** The board's label has to follow (or the back end has to accept an e-mail) when the auth screens are built.
- **The search page's URL contract** (`categoryResultsPath` and `resultsPath` in `app/paths.ts`): `/rechercher?categorie=<id>` opens with that category
  chosen (home tiles), `/rechercher?q=<text>` with that text in the title search (the bar's field). The search field no longer leads to a search page
  (R1 below: it opens the search over the page; `/rechercher` with nothing to search for only invites to search). SearchScreen reads these (and `exacte`, `tag`, `auteur`, `tri`, see below).
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
  (64 px badge, tighter padding; the 140 px bowl is now the 160 px mascot, see R4): `size="compact"` on `EmptyState` and `ErrorState`.
- **Dev database**: the local database holds 51 leftover test categories (`dessert-…`, `gouter-…`), so the real home page shows
  a long row of tiles. They are data, not a bug; the front shows every `MAIN` category.

## SearchScreen (`/rechercher` and `/mes-recettes`)

Built from `Rechercher-entrees`, `-filtres`, `-etats`, `-mes-recettes`, `-tablette` and `-ordinateur`. **The URL is the state**:
`?q=` (title text, 200 characters at most) `&categorie=<id>` `&exacte=1` (only that category) `&tag=<id>` `&ingredient=<id>` (repeated, one per ingredient, twenty at most) `&auteur=<text>`
`&tri=recentes|modifiees|titre-az|titre-za`; only what differs from the default is written (`app/searchCriteria.ts`). Changes replace
the history entry, so « back » returns to where the reader came from. **Since R1 (below) the title text is typed in the search overlay,
not in the page: the field of the page only shows it, and the overlay's `Rechercher` writes it into the address.**

**Where the boards ask for more than the API gives** (decided, not asked: the board itself says so on `Rechercher-filtres`):

- **The ingredient filter** was first left out (`GET /recipes` had no such criterion); the back end now takes `ingredientIds` and it is built, see [the ingredient filter](#the-ingredient-filter-retouche-1-follow-up) below.
- **One category and one tag at a time** (the API takes a single `categoryId` and `tagId`): the category tree uses radio buttons
  with « Toutes les catégories » to choose none; tags are chips of which one is pressed. A category includes what is filed
  beneath it, which is the API's default; « Uniquement cette catégorie » (a checkbox under the chosen parent) asks for
  `includeSubcategories=false`. The badge of a section is therefore 0 or 1. **What the back end would need** for the boards as drawn: a
  list of category ids and of tag ids (with an AND/OR rule) and an ingredient criterion.
- « Les plus utilisés »: the API has no usage count, so the tags are all shown (chosen first) and the field narrows them.

Other decisions: filters on a phone and a tablet are, since R1, part of the search overlay's `BottomSheet`, working on a **draft**
(« Rechercher » applies it; closing drops it; « Réinitialiser » clears the draft), centered from 600 px; on a desktop a 270 px column
applies each choice at once. The sheet's handle is a button (it closes; there is no drag). The sort is a sheet of radio buttons on a phone and the
browser's own list on a desktop. Section pills jump to their section and follow the scroll. The suggestions of the category and tag
fields are a `Combobox` (start of word, accents and case ignored, five at most, nothing created). While a new answer comes, the
previous one stays with « Recherche… » in the count line. « Mes recettes »: author fixed to the member by id (an `auteur` in the URL
is ignored), locked chip not counted among the filters, « + » extended at the top of the list and hidden for a first recipe.

## RecipeScreen (`/recettes/:id`)

Built from `Fiche-haut`, `Fiche-corps`, `Fiche-audiences`, `Fiche-etats` and `Fiche-grands-ecrans`, checked at 390, 768 and 1280 px.
Public: the content is the same for a visitor, a member and the author; only the actions differ (`Fiche-audiences`).

- **Data**: `GET /recipes/{id}` (`useRecipe`), turned into what the page shows by `recipeView.ts`: it drops what cannot be shown (a
  response with no id or title, an ingredient line with no name, an ingredient group with no line) and what says nothing (an introduction
  or tip that is only `<p></p>` or `&nbsp;`; a step with neither words nor a picture). A step that is only pictures stays. Nothing the
  API lacks is drawn: no time, servings, difficulty, rating, favorite or sharing; the byline is « Par … · ajoutée le … », with
  « modifiée le … » only when it is another day.
- **Layout**: a phone has the 4:3 gallery over the whole width (the way back as a cream disc top-left, the author's « ⋯ » menu top-right,
  arrows, the « 1 / 4 » counter bottom-right, dots and thumbnails under it), then the title block, the ingredients, « Cuisiner pas à pas »,
  the preparation and the cook's tip. A tablet is the same in a 640 px column. A desktop is a 12-column grid: gallery (7) beside the title
  block (5, with « Modifier » and « Supprimer » for who may), then the ingredients (5, sticky at 24 px, with the cooking button) beside the
  steps (7, 653 px of text at most). `PhotoSlider` is the shared gallery: one photo shows no controls, none shows the « no photo yet » mascot (R4).
- **Ingredients**: groups with their title, quantity in bold, `ingredientLine` adds « de » or « d' » between the unit and the name (silent
  or aspirated h: the short list of aspirated words is in `lib/ingredientLine.ts`) and writes quantities with the French comma.
- **Steps**: numbered consecutively (`StepNumber`, the brick stamp), text in `RichTextView`; one photo shows large, several as a row of
  thumbnails; a touch opens `PhotoViewer` (a Radix dialog: arrows, arrow keys, Escape, focus returns to the thumbnail).
- **Rich text**: every stored HTML goes through `RichTextView`, the only place that uses `dangerouslySetInnerHTML`. DOMPurify keeps `p`,
  `br`, `strong`, `b`, `em`, `i`, `ul`, `ol`, `li` and no attribute at all (tested with script, event handler, link, image and style cases).
- **The shell's « + » is hidden** on this page (`useCreateButtonMode('hidden')`): the page has its own actions and the button would cover
  the tip. The shell then also drops the 104 px it keeps free under a page for the « + ».
- **Cooking entry**: « Cuisiner pas à pas » (a link to `/recettes/:id/pas-a-pas`; hidden for a recipe with no step) says « Reprendre à
  l'étape N » when this device remembers a step (`app/cookingProgress`, `localStorage`, 1-based, nothing breaks if storage is blocked). On a
  phone, once that button has scrolled out of the top, the same link stays in a bar above the tabs: the shell's `TabBar` has an empty
  slot and `BottomSlotContext` hands it to the page, which renders into it with a portal. Not on a tablet or desktop, where the button
  of the page is enough (and sticky on desktop).
- **Who may change it**: `canManageRecipe(session, authorId)` (the author, or an `ADMIN`; the server stays the authority). A « ⋯ »
  `DropdownMenu` on a phone and tablet, two buttons beside the title on a desktop. « Modifier » links to `/recettes/:id/modifier`
  (the recipe editor).
- **Deleting**: an `AlertDialog` names the recipe and says it is irreversible; « Annuler » comes first and has the focus. After the
  confirmation the dialog stays up with a busy button while the request is on its way (it cannot be sent twice), then the page leaves for
  the search with `replace`. A `404` counts as deleted; any other failure closes the dialog, keeps the page and shows a banner with the
  cause (`403` included: « Tu n'as pas le droit… ») and « Réessayer ».
- **The way back**: `useGoBack(paths.search)` goes back in the history when the visit has one inside the app, else to the search, so a
  shared link still has a way back.
- **States**: loading (a skeleton of the page, announced once), `404` (the only `h1` of the page: « Cette recette n'existe pas ou a été
  supprimée », a link to the search), network error and every other failure with the sentence of its cause and « Réessayer ».

## Auth screens: sign-in, registration, forgotten and new password

Built from `Marque-ecrans` (sign-in), `Compte-inscription`, `Compte-mot-de-passe-oublie`, `Compte-nouveau-mot-de-passe` and
`Compte-public-grands-ecrans` (the tablet and desktop versions of the three last), checked at 390, 768 and 1280 px. They are
full-screen pages (no tabs, no top bar) built on one `AuthFrame`: a butter band with the logo (232 px high, 160 px logo; the sign-in
250 / 196; the welcome 280 / 196) and the way back, « Retour », as a 52 px pill in its corner. From 600 px the band disappears into a
calm striped background (`bg-calm-stripes`, the two palest butters), the logo sits above a centred 520 px card (radius 24, 28 / 32
padding). **The sign-in is the exception from 1024 px**: a 960 px card with the butter panel (300 px logo) beside the form, on the plain
page, as `Marque-ecrans` draws it. The routes are lazy: an entry screen costs nothing to the pages everybody opens.

- **Sign-in (`/connexion`)**: the field stays « Nom d'utilisateur » (the API logs in by username; the board says « Adresse e-mail »).
  A refused login (401) is one banner on top and the **password** field in its brick frame (`TextField invalid`, no message of its own);
  what was typed stays. The password has the show / hide eye. Two deviations from the boards: on a **tablet** it is the same card as the
  other entry screens (`Marque-ecrans` has no tablet), and on a **desktop** « Créer un compte » stays under the form (the board's
  desktop version omits it, which would leave no way to register).
- **Registration (`/inscription`)**: five fields (username 3–50, address, password 8–50 with the live rule, first name and last name
  « facultatif », sent only when filled). `autocomplete` values as the board lists them. A `409` is said **by the field it is about**:
  the back end puts it in the problem's `detail` (« Username already exists » / « Email already exists »; `conflictedField.ts` reads it),
  the field is framed and focused, the rest is kept, and for an address « Mot de passe oublié ? » is offered right away. A conflict whose
  detail names neither is one sentence on top. Then the **welcome**: « Bienvenue, odile74 ! ». The creation of the account is followed
  by the sign-in with what was typed (« On t'installe à table… », a busy « Connexion… » button), then « Te voilà connecté. » and
  « Découvrir les recettes ». If that automatic sign-in fails, the account is still theirs: a banner and a « Se connecter » link.
- **Forgotten password (`/mot-de-passe-oublie`)**: only the shape of the address is checked. The confirmation (« Regarde ta boîte mail ») is
  the same for every address and never repeats it; « Renvoyer un e-mail » waits for a written countdown (`role="timer"`, 60 seconds: the
  board's « 42 s » has no stated start, 60 is a pause, not a rule of the back end). A network failure has the board's banner with
  « Réessayer »; the other causes use their own sentence, with « Réessayer » when trying again can work.
- **New password (`/reset-password?token=…&email=…`, a path fixed by the back end)**: the account is named with its address masked
  (`o***@exemple.fr`), the first field has the eye and the rule, the confirmation stays hidden and says « Les deux mots de passe ne sont pas
  identiques. ». **One state** for every link that does not work: unknown, expired or used token (all the same `400`), and an address opened
  without a token or with something that is not an address (no request is made). Success is « Mot de passe modifié » and a « Se connecter »
  button: nobody is signed in on their behalf. These two screens have no « Retour »: the member came from an e-mail.
- **Common**: the screen that replaces a form (welcome, confirmation, result) takes the focus on its title (`useFocusOnMount`), so a
  keyboard or screen-reader user is not left on a control that is gone. While a request runs the fields are locked (dashed) and the
  button is `busy` with the board's wording (« Création du compte… », « Envoi… », « Modification… », « Connexion… »). The shared texts
  and limits are in `app/strings.ts` (`auth`) and `app/authValidation.ts`.

## AccountScreen (`/compte`)

Built from `Compte-page`, `Compte-etats` and `Compte-grands-ecrans`, checked at 390, 768 and 1280 px. A page for members only (the
`requireMember` loader), with the « Compte » tab active. The shell's « + » is hidden: the page has its own buttons.

- **Layout**: a title, the identity block (96 px avatar, username, address when known, role pill: « Membre » or « Administrateur »),
  three cards (Profil, Adresse e-mail, Mot de passe), the « Mes recettes » row and « Se déconnecter » at the bottom. **From 600 px** the
  sections have a 200 px index on the left (`SectionIndex`, sticky: each entry scrolls to its card, the yellow pill follows the card being
  read, `useActiveSection`), the cards are the rest of the width (800 px at most), and « Se déconnecter » moves into the index after a dashed
  rule. From 1024 px the first and last names, and the new password and its confirmation, share a row, and the buttons are as wide as their words.
- **Each card is saved on its own**: a button that is dashed until something changes, then primary; a « Modifications non enregistrées »
  mark under the title; while it runs the card is locked and the button says « Enregistrement… ». The e-mail card shows the address and
  « Modifier », and only then opens the new-address and current-password fields, so an address is not changed by accident.
- **What a failure says, and where**: a `409` goes to the field it is about (username on the profile, address on the e-mail card; same
  reading of the problem's `detail` as the registration, `app/conflictedField.ts`); a `403` on the e-mail or password card is the current
  password, said on its field (« Le mot de passe actuel est incorrect. »: wrong and missing answer the same on the back end); a form error is
  under its field. Anything else is a **notification** (« Enregistrement impossible. » and the sentence of the cause) that stays until closed,
  with « Réessayer » when trying again can work, which sends exactly what is in the fields. A `401` is the shell's « Ta session a expiré. »
  dialog: the page stays behind it (`useMember` keeps the member while the session is expired), nothing typed is lost.
- **Notifications** (`Toast`, `ToastsProvider` in `RootLayout`, `useToasts`): ink, a ticked green dot for success (« Profil mis à jour »,
  « Adresse e-mail modifiée », « Mot de passe modifié », gone after 4 seconds), a stay-until-closed alert for a failure. Above the tabs on a
  phone, bottom right on a desktop. Once the password is changed its fields are emptied: no password stays on the screen.
- **« Se déconnecter »** asks first (`Te déconnecter ?`, a butter badge since nothing is destroyed; « Rester connecté » is the primary
  button and takes the focus), then signs out and goes to the home page.
- **What the back end cannot do, and what the page does about it**: there is **no way to read the signed-in account** (no `GET` for the
  profile; the token holds the username, id and roles only). So the address and the first and last names are known only after a registration
  or a change in the same visit (`useKnownAccount`, filled by the answers of `POST /users/create` and `PUT /users/update`, by account id).
  Until then the card says its names are not shown and that an empty field is left as it is (an absent field is left alone by the back end), and
  the e-mail card says the current address is not shown and still lets it be replaced. **What the back end would need**: a
  `GET /users/me` returning the `UserResponse` (then only `useKnownAccount` starts fetching, and the page can have its « Chargement de ton compte… » skeleton
  of the board). A renamed member keeps their old username in the token until the next sign-in, so a reload shows the old one again; the app shows
  the new one for the life of the tab (`sessionStore.rename`).
- **Left out**: the « Administration » row (the pages it leads to are not designed yet).

## RichTextEditor (`Editeur-texte-riche`)

One component for the three rich texts of a recipe (`variant`: `introduction` 18/28 and 144 px, `step` 22/34 and 160 px, `advice` 18/28 and
112 px), built on Lexical **0.52.0, every package pinned to that exact version**, with the extension API (`LexicalExtensionComposer`; the
plain `LexicalComposer` is deprecated in this release). Checked in the browser at 390, 768 and 1280 px through the development `/styleguide`.

- **Six tools, in three groups, and no more** (**extended to nine, and one line that scrolls, by R3**, below): bold, italic · bulleted list, numbered list · undo, redo. 44 px buttons, `aria-pressed` for the
  tools that are on at the caret (yellow, ink outline), undo and redo dashed while there is nothing to undo or redo. Pressing a tool never takes
  the focus out of the text (`mousedown` is prevented). Ctrl + B, I, Z and Shift + Z work as in any editor.
- **What it refuses** (underline and strikethrough are allowed since R3): no heading, quote, link, image or colour. A shortcut for another format is swallowed
  (`FORMAT_TEXT_COMMAND`), a heading or a quote that arrives with a paste becomes a paragraph (node transform), and Tab leaves the field.
- **What it stores** (`htmlConversion.ts`): the HTML is written by hand from the editor's tree, in the viewer's own vocabulary only (`p`, `br`,
  `strong`, `em`, `u`, `s`, `small`, `big`, `ul`, `ol`, `li`, the last four from R3), with no attribute (Lexical's own export adds styles and classes), without the blank paragraphs and list
  items a stray Enter leaves, and `''` when nothing is written. **What it opens** goes through the same `sanitizeRichText` (DOMPurify) as the
  viewer first, so a script stored in a recipe never gets into the editor either. Both directions are tested against hostile input.
- **The field**: label above (with « facultatif »), a frame like the text fields (2 px ink-500; 2 px ink and a 3 px ring on focus; 3 px brick and a
  rosy background in error), the toolbar in the field's top on a tablet and a desktop. **On a phone** (replaced by R3: there is no bar in the
  field any more, the tools come with the writing mode, above the keyboard through `useKeyboardInset`).
- **Use**: `initialHtml` and `onChange(html)`: the editor keeps the text itself after it has started (give it a new `key` to replace it, e.g. to
  restore a draft). It does not report the text it started with as a change.
- **Tests**: jsdom does not deliver typed characters to a contenteditable, so insertions go through the editor's own API
  (`getNearestEditorFromDOMNode`); the buttons, commands, history and conversions under test are the real ones.

## RecipeEditorScreen (`/recettes/nouvelle` and `/recettes/:id/modifier`)

Boards: `Editeur-cadre`, `Editeur-categories-tags`, `Editeur-photos`, `Editeur-ingredients`, `Editeur-etapes-conseil`, `Editeur-validation`,
`Editeur-session-droits`, `Editeur-grands-ecrans` (and `Editeur-texte-riche`, see below). One screen for creating and for changing; a full-screen
task (no tab bar), behind `requireMember`. Checked in the browser pane at 390, 768 and 1280 px with a mocked back end (the harness mocks every
endpoint it calls, including `POST /media` and `POST /ingredients`).

- **It opens when it can be used**: the vocabulary (category tree, tags, units: three public calls) is loaded first, then, to change a recipe, the
  recipe itself. Loading, a failure (« Impossible d'ouvrir l'éditeur » with « Réessayer »), a recipe that is not there (`404`, the lost mascot) and a recipe
  the member may not change (`403` from the server, or `canManageRecipe` false: the padlock, « Retour à la recette ») are whole pages, never a
  form that could not be saved. The editor is keyed by the recipe: going from one recipe to another starts again from the new one.
- **One form, one model** (`editorModel.ts`): `EditorValues` is the whole recipe in the shape the form needs (a category is `{ id, label }`, a
  quantity is the text typed, `1,5` or `1.5`). A new recipe starts from `newRecipeValues()`: nothing written, but one group without title with one
  empty line and one empty step already there (the boards draw no such start; asking for « Ajouter un groupe » then « Ajouter un ingrédient » on a
  phone for every recipe is friction the data model does not need). The rules are one Zod schema (`editorSchema`, limits of the contract: title 200,
  group title 200, note 200, picture description 500, quantity a decimal of zero or more); the server stays the authority and its `400` is shown.
- **Saving is `POST /recipes` or `PUT /recipes/{id}` with the whole form**: an update replaces every collection it carries, so it always sends
  them all, and an emptied introduction or tip is `{ text: '' }` / `''` (an absent field would leave it). The button is `Enregistrer`, not a form
  submit: « Entrée » in a field ends the line and never sends a recipe from a phone's « Go » key. While it is on its way the button is busy, the
  fields (a `fieldset`) and the rich texts (`locked`) are locked, and it cannot be sent twice.
- **What is missing is said twice and never once**: after a refused `Enregistrer` a brick banner under the bar says « Il manque / Il reste N choses :
  … » with a 44 px link per kind (the focus goes to the first field to correct, a link takes to the part), each field says its own defect, and from a
  desktop the index counts the things to correct in each section (« Informations, 2 problèmes »). The summary is live: it follows what is mended and
  disappears when all is there. `problems.ts` is the one place that turns the schema's issues into these words.
- **Every failure of a save keeps the form**: `400` and other refusals that trying again cannot mend are a notification that stays; `5xx`, `503`
  (with `Retry-After`) and a lost connection add « Réessayer », which sends the same recipe; `403` and `404` replace the form by their page, keeping the
  draft; `401` is the app's session dialog (no second message), see the draft below.
- **The draft** (`editorDraft.ts`, `useDraftSaving.ts`): the whole form is kept in `localStorage`, one draft per recipe being changed and one for
  the new recipe, 600 ms after the typing pauses, with the indicator of the board (« Enregistrement du brouillon… », « Brouillon enregistré sur cet
  appareil », « … non enregistré » when the device refuses). A form equal to what it started from has no draft (opening a recipe creates none). A
  draft found at the opening is **offered** (« Reprendre ton brouillon ? », « Reprendre » / « Recommencer »; the second asks again, and its first
  answer keeps the draft); typing before answering does not overwrite it. A draft equal to the recipe is not offered.
- **A lost session loses nothing**: at `401` the draft is kept at once and the tab notes it (`sessionStorage`); the app's dialog sends the member to
  the login with this address as the way back, and the editor, opened again, takes the draft up **without asking** and says « Te revoilà : ton
  brouillon est intact. ». The note is read once. The leave guard stands aside without a session.
- **Leaving with changes asks** (`useBlocker` for the cross, « Annuler » and the browser's back, `beforeunload` for a tab that closes): « Quitter
  sans enregistrer ? », the first answer (« Continuer à modifier ») the primary one, since nothing is destroyed either way. Saved: the editor
  leaves for the recipe by replacing its entry, so « retour » does not come back to a form.
- **Reordering is by two buttons, never by dragging (R7 below)**: arrows on a photo, « Monter » / « Descendre » on a group, a line and a step,
  with a French announcement of where the item went. After a button moved an item the focus follows it. Photos and steps are numbered by rank, so
  reordering renumbers. A line stays in its group. (The first build also had a grip to drag by, with dnd-kit; R7 took it out.)
- **Photos** (`PhotoGallery`, the same tiles for the cover and for each step): JPEG or PNG of 8 MB at most, checked before anything is sent; sent
  one after the other so the list keeps the order they were chosen in; a refusal stays in its place under its words (`413` « 8 Mo maximum »,
  `429` the button counts down the `Retry-After`, `503` « Service momentanément saturé », a lost connection) until it is sent again or given
  up; « Annuler l'envoi » aborts the request. **Differences from the board**: the bar of a picture on its way is indeterminate (the browser's
  `fetch` has no upload progress, the board draws « 64 % »); a format or size refusal offers only « Retirer » (the board adds « Réessayer », which
  could only fail again); a picture on its way has no preview. A save asked while a picture is still on its way is refused with a notification
  (the picture would be left out without a word). The first photo is « Couverture ».
- **Ingredients** (`AutocompleteField`, `useIngredientChoice`): the ingredient of a line is chosen among those that exist (`namePrefix`, as typed,
  200 ms after the typing pauses), never by the typing alone; editing the text takes the choice back. When nothing is exactly right the last
  line of the list is « Créer « x » » (only offered once the search for what is typed is answered): the field is locked while it is made, then the
  ingredient is chosen. **`409` is not an error**: the ingredient that exists is looked up and chosen, with « « x » existe déjà. On l'a choisi pour
  toi. ». Any other failure says so under the line, keeps the text and offers « Réessayer ». Units are a native `select` of the existing ones.
  The quantity accepts the French comma. A line removed can be taken back from the notification (« Ingrédient retiré. Annuler », 4 s); a group
  with something in it asks first (the first answer keeps it), a blank one goes at once. Errors are said once under the whole line, wide enough
  to read, with the note's counter.
- **The tip** is the stitched frame of the recipe page with its handwritten title, a plain ink frame with the ring while it is written in; its
  tools come with the keyboard on a phone (no bar at rest), inside the frame from a tablet. The title of the field is « le petit conseil » where the
  recipe page says « le conseil de la cuisinière »: the boards disagree, left as they are (a question for the designer).
- **Deleting** (`DeleteRecipeSection`) is a brick underlined link at the foot of the page, only when changing; it uses the same dialog and
  `useRecipeDeletion` as the recipe page, and the same failure banner (`DeletionFailureBanner`).
- **Tests**: `RecipeEditorScreen.*.test.tsx` share `editor.testkit.tsx` (the fake back end, the render, the fill-in helpers); a `*.testkit.tsx`
  file is test code for the lint rules. The photo tests replace `uploadMedia` (jsdom's `FormData` cannot be sent by Node's `fetch` once a handler
  waits, see [frontend-stack.md](frontend-stack.md)); the request itself is the API layer's tests. Rich texts are written through Lexical's API.

## CookingScreen (`/recettes/:id/pas-a-pas`)

Boards: `Pas-a-pas-entree` (the entry, built with the recipe page), `Pas-a-pas-etape`, `Pas-a-pas-fin`, `Pas-a-pas-etats`, `Pas-a-pas-grands-ecrans`. A full-screen mode, open to anyone with the
link (like the recipe, no login). Checked in the browser pane at 390, 768 and 1280 px with a mocked back end.

- **It is the recipe, one step at a time**: the page loads `GET /recipes/{id}` and builds the same view model as the recipe page
  (`app/recipeView`, moved there from the recipe screen since both read it). A recipe that is not there, that cannot be loaded (`RecipeProblem`,
  moved to `app/` for the same reason, with its « Réessayer ») or that has **no step** is said on a page of its own: the mode is never opened empty
  (the entry button does not exist for such a recipe, this is for a typed address).
- **A step** (`Cooking`): the top (« Quitter », the title on up to two lines, « Étape 3 sur 8 » and the progress), ~~the stamp (`StepNumber` with its word: brick,
  104 px, tilted)~~ (**gone since R5, on every screen**: the number is in the bar), the instruction in the 22/34 text (`RichTextView`, sanitised like everywhere), the photos, a full-width « Ingrédients » row, and the
  foot with « Précédent » and « Suivant » (64 px, the second twice as wide, « Terminer » with a tick on the last step). Only the instruction scrolls, from its
  top for each step; a fade at the foot says when there is more below. A recipe of one step has no progress and no « Précédent ».
- **Progress** (`StepProgress`): a segment per step up to twelve (done in ink, current in yellow with an ink outline, to come in cream with a lighter outline: three signs, not
  the colour alone), a thin continuous bar (`ProgressBar size="thin"`) from thirteen. It is `role="progressbar"`, and « Étape 3 sur 8 » is a polite live region.
- **Three ways forward and back, none the only one**: the buttons, a swipe (`useSwipe`: a finger or a pen, at least 60 px and mostly sideways, so scrolling is not a swipe, and never
  a mouse, which selects text), and « ← » « → » on a keyboard (« Échap » asks to quit); the keys are left alone while a dialog, a sheet or the viewer is open. A hint
  « Glisse pour changer d'étape » is told once per device (`localStorage`), disappears after six seconds or at the first change of step.
- **Where the cook is** (`useCookingProgress`, `app/cookingProgress`): the step is remembered from the second one on, so that the recipe page says « Reprendre à l'étape 3 »; coming back to the first
  step or finishing forgets it; a remembered step past the last one (the recipe lost some) is clamped. Quitting keeps it.
- **The ingredients to tick** (`useIngredientChecks`): a sheet from the bottom on a phone (`BottomSheet`), a panel on the right from a tablet (320 px, 420 px from a desktop; opened from the
  top bar, the step moves aside), the same checklist: lines of 64 px with a 36 px box, a ready line is yellow-ticked, struck through and in ink 700 (still 6.9:1). The ticks live as long
  as the recipe is open (nothing is stored: what was set out an hour ago says nothing about the next time); « 3 sur 10 prêts » is on the row, in the sheet and beside the top button.
- **Leaving asks** (`QuitDialog`): « Quitter le pas à pas ? » with « Rester » (secondary, first, focused) and « Quitter » (primary: nothing is lost, so no brick).
- **The end** (`FinishScreen`): « Bon appétit ! » (focused), the brick stamp laid on the cover photo (or alone without one), what was cooked (« l'unique étape » in the singular), the cook's
  tip in the stitched frame (`AdviceNote`, promoted to a shared component, titled « le petit conseil » here as on the board; the recipe page says « le conseil de la cuisinière ») only when the recipe has one, and
  « Revenir à la recette » (primary) / « Retour aux recettes ».
- **The photos** reuse `PhotoViewer`, which gained the counter pill (« 2 / 3 ») and a swipe from the board; one photo is a 4:3 frame with 24 px corners, several a row of thumbnails.
- **Not on the boards, but a kitchen needs it**: the screen is kept on while cooking (`useWakeLock`, the Screen Wake Lock API; asked again when the page is back, ignored where the browser has none or refuses).
  No timer, no other function the data does not have (the board says so).
- **Differences from the boards**: the title may take two lines (at 390 px a long title would otherwise be cut by the large « Quitter »); there is no key for « Ingrédients » (none is drawn); « Ingrédients » uses the
  « Couverts » icon the board suggests; the board's photo « Agrandir la photo » is a button, not a link.
- **Tests**: `CookingScreen.test.tsx` goes through every state and gesture at the three widths; the hooks that need a browser API (`useSwipe`, `useWakeLock`, `useCanScrollMore`) have their own tests.

## Retouches

The canvas page « Retouches » holds five design changes applied on top of the screens above. Each one is written here before it is
built; the newest board wins over an older one, and the API contract wins over any board. Where a board is ambiguous the most
conservative reading is taken (it changes the least, invents no data and keeps the existing behaviour) and written down.

### R5 · the cooking step without the stamp (`Retouche-5-etape-sans-badge`, `-fin-sans-badge`, `-etats-sans-badge`, `-grands-ecrans-sans-badge`)

Replaces the stamp of `Pas-a-pas-etape`: the brick « ÉTAPE n » seal of 104 px that sat above the instruction. The number is already in the bar
(« Étape 3 sur 8 » and the segment), so the instruction and the photos move up by the 118 px (104 + the 14 px gap) the stamp took.
**It was first drawn for a phone only; the board was then changed to remove it on every screen** (phone, tablet and desktop: the three other R5
boards show the ingredients sheet, the end screen, the limit cases and the tablet and desktop layouts without it), and that is what is built.

- **Nothing else moves**: the bar, the 22/34 instruction (560 px at most on a tablet, in a 560 px column, and 680 px on a desktop), the photos
  (one 4:3 frame or a row of thumbnails), « Ingrédients », « Précédent », « Suivant » and the swipe hint keep their sizes and places. The
  padding under the bar stays 14 px. The swipe hint stays at the foot of the reading area, just above « Ingrédients », also when the instruction
  is short (the reading area is a column whose text fills it, so the hint's sticky row ends at the bottom).
- **Built in `StepContent`**, which no longer has a `showStamp` (it had one while the stamp stayed on a tablet): the instruction, then the photos.
  `StepNumber` lost its `word` variant, the 104 px stamp, and is only the 64 px number of a step of the recipe page; the `stamp` string is gone.
- **Stays**: the « bon appétit ! » stamp of the end screen (another stamp: it repeats nothing).
- **The six states of the board** (no photo, one photo, several, first with its swipe hint, last with « Terminer », very long step) are the
  existing states of the screen. The first version's fourth « ce qui change » (a 32 px « ÉTAPE 3 » pill, « si tu préfères le garder ») was an
  alternative offered to the user and is not built.

### R2 · the cocotte logo (`Retouche-2-cocotte`)

Replaces the « Sceau et bol » logo (`Logo-bol`, and the seal of `Marque-ecrans`) everywhere. The board's proposal B is the validated one: lid open
at 18° on the right edge of the pot, three thin steam lines, thin highlights, a real mouth.

- **Four drawings, one per format** (the board's table of what each size keeps and drops): large (`pb-L`: everything), lockup (`pb-M`: no
  rivets, cheeks, tongue, lid band or foot; thicker line), compact mark (`pb-S`: silhouette, lid with its knob, steam, eyes, small mouth,
  highlights), icon (`pb-XS`: no steam, lid opened to 24°). They are copied into `cocotteShapes.tsx` as they are on the board, with their
  colours turned into `--logo-*` variables.
- **`Logo` API**: `variant` is now `large` | `lockup` | `mark` (it was `seal` | `lockup` | `bowl`: the old names no longer describe anything).
  `size` is still the rendered height. The large logo and the lockup **carry the name** (Fraunces 800 in the SVG: the board sets it in HTML, so
  the optical size of the font is pinned to the board's, 36 under the large logo and 29 beside the lockup, and the widths measured there are
  fixed with `textLength`); the mark under 40 px draws the icon. Tones as before; the board's one-colour version is cream fills with ink lines
  (not transparent). The accessible name is unchanged (« Il en reste un peu »).
- **The large logo is taller than the old seal was for the same `size`**, because the name is part of it (the board draws the cocotte alone with
  the name under it): in `AuthFrame` the same box now holds the cocotte and its name. Where the logo sits and how big is the work of R4
  (« logo en situation »).
- **Favicon and icons**: `public/favicon.svg` is the icon drawing on a butter-100 tile (128 px, radius 32, 2 px ink line), as the board draws it;
  `favicon.ico` (16 and 32 px) and `apple-touch-icon.png` (180 px, full-bleed butter-100, cocotte at 64 %) are rasterized from it in the
  browser (canvas), since the project has no image tooling. **The 192 and 512 px icons are not made**: the repository has no web app manifest
  (only `favicon.svg` existed), so they would be used by nothing, and a manifest would make the site installable, which no board asks for. They
  go with a manifest if one is wanted (« à valider »).

### R4 · the mascot « Mijotine » and the logo in situation (`Retouche-4-mascotte`, `-situations`, `-logo-en-situation`)

The logo's cocotte, grown, with a name (Mijotine), seven moods and four sizes, put in the places where the app says something dry.

- **`Mascot`** (`src/components/Mascot`): `mood` is `happy` (contente) · `dejected` (dépitée) · `smitten` (coup de cœur) · `surprised` · `lost`
  (perdue) · `asleep` (endormie) · `celebrating` (en fête); `size` is `xl` (240 px wide: empty states and error pages) · `large` (160: cards
  without a photo) · `medium` (96: messages and dialogs) · `small` (64: stamp, avatar). The seven drawings are the board's symbols (`ms-*`),
  copied as they are into `mascotShapes.tsx` with their colours as `--logo-*` variables (plus `--logo-herb` and the six `--logo-party-*`, from the `party-*` tokens, for the striped party hat and the confetti). **The faces were redrawn on the board after the first build** (a wider mouth with its tongue, a new party hat, other details), so `mascotShapes.tsx` was regenerated from the symbols as they are now; the hat's stripes are clipped by a clip path whose id comes from the `Mascot` that draws it (`useId`). It is
  **decorative** (`aria-hidden`): every place that shows it also says what it means in words, and the mood is never the only signal.
- **Small sizes**: the board's prose says the steam and the accessories disappear at 64 px and under, but its own drawings at 64 and 40 px are
  the same symbols simply scaled. No smaller drawings exist, so the same drawing is scaled (the most conservative reading: nothing is invented).
- **Where each mood is used** (the situations of `Retouche-4-situations` that exist in the app):
  - **happy**: the sign-in (instead of the logo, with the board's welcome sentence instead of the name), the first-visit empty feed, an empty
    « Mes recettes » (and the empty member feed).
  - **dejected**: a recipe card and a recipe page with no photo (« Pas encore de photo »); for the author the page adds « Ajouter une photo »,
    which leads to the editor.
  - **lost**: a search with no result, a page or a recipe that does not exist, and the other « nothing there » pages (editor refusals).
  - **asleep**: no connection (the board's « Je fais une petite sieste »; the board's second sentence promises an automatic wake-up and says
    drafts are kept, which is not true of a plain « Réessayer » page, so the existing sentence stays).
  - **celebrating**: right after a recipe is created (a dialog on the recipe page: « Ta recette est publiée ! », « Voir la recette », « Écrire
    une autre recette »). Only for a creation, not for a change; the « toute la première fois » reinforcement is not built (the app cannot tell
    cheaply whether it is the member's first recipe).
  - **Left out, with the reason**: *coup de cœur* (a favourites mark: the API has no favourites, so the mood exists but nothing uses it, and the
    words « mettre en favori » of the published screen are dropped), *surprised* (the end of a timer: the cooking mode has no timer, the board
    itself says so), *asleep for a very long loading* (the app has no slow-loading state to attach it to).
- **`BowlIllustration` is deleted** (the mascot replaces it everywhere it was used).
- **The logo in situation** (`Retouche-4-logo-en-situation`): the desktop bar's lockup goes from 40 to 52 px; the mobile header keeps the 44 px
  lockup but shows the compact mark (no name) under 360 px; the entry pages show the large logo with its cocotte at 190 px, except the
  screens that have a « Retour » pill (registration, forgotten password), which keep 160 px since the pill would cover the steam of a larger logo; the favicon and icons are R2's.

R4, as built: every empty and error block, `regular` or `compact`, holds the `xl` mascot (the board draws 215 to 260 px: snapped to the four sizes); the sign-in band holds the `large` one (the band is 250 px high, the board draws it on a paper page instead); a cover without a photo the `large` one too, with its caption pulled into the drawing's empty margin so both stay whole in the narrowest cards. On the yellow band the mascot takes the `on-butter` tone, like the logo. The recipe page forgets `justPublished` from its history entry at once (`useJustPublished`), so going back to it never celebrates twice. `ErrorState` takes an
`illustration` in place of its badge (the sleeping mascot for « no connection », through `app/failureIllustration`), `AlertDialog` an
`illustration` in place of its icon badge (the celebration), and `AuthFrame` an `emblem` (`logo` or `mascot`). A recipe card or gallery with no photo is
the shared `NoPhoto` (dejected mascot, « Pas encore de photo », on paper stripes); a photo that exists but cannot be loaded keeps the butter stripes
and the cutlery. The words of the **lost** states and of an empty « Mes recettes » are the board's (« Je n’ai rien trouvé… », « Ajoute ta première
recette »); the sentence under « Je n’ai rien trouvé… » names the text searched, and says to remove a filter only when there is one. **À valider**:
on the sign-in the happy mascot and « Qu’est-ce qu’on mijote aujourd’hui ? » replace the name of the application (as the board draws it).

### R3 · rich text: three more tools and the writing mode (`Retouche-3-texte-riche-mobile`, `-grands-ecrans`)

It **extends the minimal toolbar** of [RichTextEditor](#richtexteditor-editeur-texte-riche) (and the Rich text section of `CLAUDE.md`): bold and italic, the two lists,
undo and redo stay, and **text size, underline and strikethrough** are added; the bar is one scrolling line; a full-screen **writing mode** takes the field.

- **How the three are stored** (the back keeps the HTML unsanitised, `RichTextView` and the editor's loader both run `sanitizeRichText`, and
  recipes written before R3 must render unchanged): underline is `<u>`, strikethrough `<s>`, a smaller text `<small>` and a larger one `<big>`;
  Normal is no tag. **No attribute is ever allowed**, so the allow-list only grows by four tags and the DOMPurify rule « no attribute at all »
  stays true (the board's own samples are written with `<u>` and `<s>`). Old recipes contain none of the four tags, so nothing in them changes;
  the only text that could change is one that already held a `<small>` or a `<big>` that was being stripped, which the editor never wrote.
- **What the sizes mean**: they are the sizes of the recipe page's text. A step is 22/34, so there **Petit** is 18/28 (the body text) and there
  is no Grand; the introduction and the tip are 18/28, so there **Petit** is 16/22 (`text-detail`) and **Grand** 22/34 (`text-step`). CSS under
  `.rich-text` gives `small` and `big` these sizes relative to the field's own (`RichTextView` `size`), in the editor and on the page alike.
- **Inside Lexical** a size is carried by the `subscript` (Petit) and `superscript` (Grand) text formats, which the editor otherwise never
  uses (a sub- or superscript shortcut is not offered): Lexical makes them exclusive, undoes them with the rest of the history and keeps them
  across the paste and import paths. `htmlConversion.ts` (the HTML) and `textSize.ts` (the size at the caret, and choosing one with
  `SET_TEXT_FORMAT_COMMAND`, which sets both formats outright, so a selection of several sizes can be made one size) are the only code that knows
  the mapping, and the editor's CSS draws `sub` and `sup` as the two sizes.
- **The bar** (one line, the order of the board: size, bold, italic, underline, strike, bullets, numbers, undo, redo; groups separated by a
  rule): it scrolls sideways, the size button first; a fade and a « › » at the right edge say there is more until the end of the line is
  reached; 44 px tools, the board's size. On a phone it lives in the writing mode only (the inline field of the mobile board has no bar); from
  a tablet it sits at the top of the field, the « Écrire en plein écran » button on the label line. In the writing mode it sits at the bottom
  on a phone (above the keyboard) and under the strip from a tablet, as the boards draw it.
- **Writing mode**: a modal (Radix `Dialog`: focus kept inside, the page behind inert, the page does not move). Phone and tablet: the whole
  screen; desktop (from 1024 px): a 920 px panel on a dimmed background, the text 760 px wide at most. A strip at the top with the way back
  (arrow), the name of the field and « Terminé »; the text fills the space down to the bar, which sits above the keyboard on a phone
  (`useKeyboardInset`). The « Annuler / Enregistrer » bar of the editor is covered, so the old problem of two bars one over the other is gone.
  - **In**: a tap on the text on a phone; on a tablet and a desktop the « Écrire en plein écran » button or Ctrl + Maj + F (Cmd + Maj + F on
    a Mac) while the text has the focus. Keyboard focus alone does not open it (the editor moves the focus to a field to correct).
  - **Out**: « Terminé », Escape, a click on the dimmed part (desktop), and on a phone the arrow (a phone's only: the tablet board draws none)
    and the device's back gesture. The text is kept in every case (it is the same editor, moved into the dialog) and the page is back on the
    same field, scrolled to it; after a mode opened **on a phone** it says the board's short « … mise à jour ». From a tablet « Terminé » is
    152 px wide (the phone's is 128), the strip and the bar have 32 px of margin and the text 64 px (a desktop panel: the text 760 px wide).
  - **Where the focus goes**: into the text as soon as it is in the mode (`EditableText`, once it has been moved: the page it left cannot do
    it), and back into the field's text after the mode on a tablet and a desktop; on a phone nowhere, so the keyboard does not come back.
  - **The back gesture**: opening on a phone adds one history entry for the same address (`state.writingMode`); the gesture pops it and closes
    the mode; closing otherwise pops it too. The leave guard only counts a change of path or search, so it does not interfere.
- **Left as they are**: Lexical stays pinned at 0.52.0 and everything the editor refuses (headings, quotes, colours, links, images).
- **Not built**: the « Brouillon enregistré » indicator the tablet and desktop boards draw in the writing mode's strip (the draft state belongs
  to the editor screen, which the field does not know; the covered editor bar keeps saying it behind the panel), and a live « Brouillon »
  reading in the mode itself. A phone's « … mise à jour » notification is the editor screen's (`useWritingDone`), told by the field
  (`onWritingDone`), and only after a mode that was opened on a phone.

### R1 · the search opens as an overlay (`Retouche-1-principe`, `-mobile`, `-grands-ecrans`, `-resultats`)

A search button no longer goes to a « Rechercher » page: it opens the search engine (the title field and every filter) over the current page, and
**validating** leads to the results page. **No button ever leads to an unfiltered list.** It replaces boards 20 (openings), takes the filter
blocks of 21 into the overlay (the sort stays on the results page), changes 22 and 23 (no entry state, no « Pendant la saisie », no « toutes les
recettes »), 24 and 25 (the overlay is a centred panel on a tablet and a panel under the bar on a desktop) and the bars of boards 6, 18, 19 and 24.

- **One overlay, owned by the app** (`app/SearchOverlayProvider`, in `RootLayout`; the container is `screens/SearchScreen/components/SearchOverlay`,
  which `app` may import). Every entry point asks it to open through `useSearchOverlay()` (outside the app, in a screen under test, that opener does
  nothing, like `useCreateButtonMode`), with what to focus (the text field, or, from « Filtres », the filters) and a first character to carry. The
  scope comes from the page: on `/mes-recettes` the search is the member's own. It works on a **draft** (`searchDraft.ts`: the text and the
  filter choices) and writes it into the address only when validated, **with the same URL model as before** (`q`, `categorie`, `exacte`, `tag`,
  `auteur`, `tri`; `app/searchCriteria`; `resultsPath`). Opened from a results page it starts from that page's criteria (and keeps its sort); from
  anywhere else it is empty. Closing it unmounts it, so the next opening never finds a dropped draft.
- **Entry points**: the home bar (phone and tablet); the « Rechercher » tab (**phone only**); the field of the top bar (desktop) and of the
  tablet header; on the results page the field, « Filtres » (phone and tablet) and the invitation's button. They are all the same `SearchLauncher`
  (a button that looks like the field; `app/SearchEntryField` binds it to the address): a printable key typed on it opens the search with that key
  written **after the word already there**. The category tiles of the home page and the « Mes recettes » tab go straight to results, with their
  filter (a tab is still a link). « Mes recettes » opens the overlay **without the author field**: the author is the member, locked.
- **Layouts**: a phone and a tablet get the bottom sheet (`BottomSheet tall`: 44 px under the top of a phone, a 600 px panel centred from 600 px;
  title « Rechercher », a close cross, the field, the section pills (only when the filters are there), the blocks, « Réinitialiser » and
  « Rechercher » fixed at the bottom); a desktop gets `TopPanel`, an 800 px panel that hangs 100 px from the top of the page (the veil starts
  under the bar, so the bar stays sharp), with the field and the close cross on the first row (its title is only for assistive technology), in
  **two columns, with no pills**: the category tree on the left, tags and author on the right, the buttons below, to the right. The text field takes the focus when it opens (and the keyboard comes up on
  a phone); opened from « Filtres » the title does, so the keyboard does not hide the filters.
- **« Rechercher »** replaces « Voir les N recettes » (no live count: the count asked a request per choice). It and the keyboard's Enter in the
  text field are **disabled until there is a word or a filter** (« Mes recettes » counts as a filter). « Réinitialiser » empties the draft without
  closing. The cross, Escape, a touch on the veil and, on a phone, the handle close it without applying anything (the sheet has no swipe, as
  before); the focus goes back to what opened it; the page behind does not move.
- **Filters that fail to load** show the brick message with « Réessayer » inside the overlay, and the text search still works.
- **The results page** has no entry state: it is reached by a validation, a category tile or « Mes recettes », always with a criterion. Its field
  and « Filtres » keep their look but are buttons that reopen the overlay, prefilled; the cross of the field clears the word, in place, like
  the removable chips and « Tout effacer ». With no criterion left (every chip dropped; or an address typed by hand) it shows the invitation
  (« Que veux-tu cuisiner ? », its button « Lancer une recherche » opens the overlay), with neither count nor sort, and **asks the API for nothing**
  (`useRecipeFeed(…, { enabled })`). The sort stays on the page, and so does the desktop filter column (it refines the results live; choosing a
  filter in it lists again). The « Toutes les recettes, … » line under the count, and the « Aucune recette pour le moment » state of the
  everybody's search, are gone with the unfiltered list.
- **The overlay belongs to the page it was opened on** (it remembers the history entry): moving through the history, with the device's back
  or forward, ends it, and it never comes back on its own. Escape in a category or tag field that is open or holds text only dismisses its
  suggestions (`useDialogFocus`), and the focus goes back to what was focused when the search was asked for, in whichever layout.
- **Back**: validating from a page **pushes** the results (so the device's back returns to the page before the search was opened, not to the
  overlay); validating again from a results page replaces that entry. The overlay itself adds no history entry.
- **Bars**: the phone keeps its tabs (« Rechercher » is a button among the links: `NavigationAction`, yellow while a results page is shown); a
  **tablet loses the « Rechercher » tab** (2 tabs for a visitor, 3 for a member) and gets a header with the logo and the search field **on every
  shell page but the home page and the two results pages** (which have their own field); a **desktop loses the « Rechercher » link** and keeps the
  field, now 56 px tall like every other field (it was 52 px).
- **« Retour aux recettes », « Voir les recettes » and the way back of a recipe opened first lead to the home page** (the feed), no longer to
  `/rechercher`: that page is never a list of everything. Spaces alone are neither a word nor an author (`isNarrowed`, `criteriaOf`).
- **Not built, and why**: the board's several categories and tags (the API takes one of each, the model is unchanged). The **ingredient
  filter** (section, pill, chip and sentence) was left out for lack of a criterion in the API, and **built afterwards**, see
  [the ingredient filter](#the-ingredient-filter-retouche-1-follow-up).
- **À valider** (the board asks too): the missing live count; the tablet header; the removed desktop link; the desktop two-column panel; the
  carried key being appended to the word of a results page; the invitation's button label.


### The ingredient filter (R1 follow-up)

The « Ingrédients » block of the R1 boards (a search field with suggestions, the ones chosen as chips, « Recettes avec tous ces ingrédients. »,
« Aucun ingrédient choisi : toutes les recettes sont retenues. », a pill with its count) is built, in the overlay's phone sheet and its desktop
panel and in the results page's desktop column. It needed the back end: **`GET /recipes` now takes `ingredientIds`** (repeated, at most 20) and keeps
the recipes that use **every** one of them, in any group (the back's `docs/recipes-domain-model.md` explains the query).

- **The criterion holds ids**, like the category and the tag: `SearchCriteria.ingredientIds` (in the order they were chosen, each once, at most
  `MAX_INGREDIENT_FILTERS` = 20, whatever a hand-written address says), `&ingredient=<id>` repeated in the address, `ingredientIds` in the request
  (`toRecipeFilters`). Each chosen ingredient is **one filter** for the « Filtres » count and for « Rechercher » being enabled.
- **Names are looked up, not carried**: the address has ids, so a chip's name comes from `useIngredientNames` (`GET /ingredients/{id}`, one cached
  query per ingredient). Choosing a suggestion **remembers** the name (`useRememberIngredient`), so a chip never waits for a request it does not
  need. An ingredient that cannot be found (deleted since the link was made) has **no chip but still filters**, like a category that does not exist;
  « Réinitialiser » or « Tout effacer » clears it.
- **Suggestions are asked of the back end** as the typing pauses (200 ms, `namePrefix`, six at most), unlike the category and the tags, which are
  loaded whole: there are too many ingredients. `Combobox` takes `onTyped` for that (its options are then the server's answer and are shown as they
  are) and `searching` (« Aucun ingrédient pour « x » » is only said once the answer is in). Only ingredients that start like the text are offered,
  so a previous answer kept on screen while the next comes never offers what no longer matches. If the search itself fails, the field says so
  (« La recherche d’ingrédients ne marche pas pour le moment… ») instead of claiming that nothing matches; the word search still works.
- **Not waiting for the other filters**: the section (and its pill) shows while the category tree and the tags are still loading or failed to load,
  since it needs none of them, like the author field.
- **Twenty at most**: the API refuses more, so at twenty the field is replaced by « 20 ingrédients au maximum. » and the chips still drop.
- **On the results page** a chosen ingredient is a removable chip like the others (« Retirer le filtre Pommes »); removing the last criterion shows
  the invitation, as for any filter. The chip in the overlay has the cutlery icon the board draws (`RemovableChip` `icon`).
- **À valider**: "all of them" (AND) is what is built, from the board's sentence « Recettes avec tous ces ingrédients. »; "any of them" would be
  another parameter. The suggestions match the start of the ingredient's name, as the editor's field does, not a word inside it.

### R6 · the numbered-list icon (`Retouche-6-icone-liste`)

The « liste numérotée » icon is redrawn so that 1, 2 and 3 can be told apart from 24 px up: the digits are taller (5 units, well separated) and drawn
thinner (1.4) than the rest of the icon, and the three lines of text stay at the usual weight. It is the `list-number` shape of `iconShapes.tsx`, so
the rich-text toolbar and the styleguide use it. The board says to adopt it everywhere and does not replace its own « Icônes » board (11), whose
drawing stays the old one.

### R7 · the editor without drag handles (`Retouche-7-photos`, `-ingredients`, `-etapes`, `-grands-ecrans`)

The cover photos, the steps and the ingredient lines **lose their handle to drag by**, and with it the « glisser une photo / une étape » screens: they
are reordered with their buttons only (the left and right arrows of a photo, « Monter » and « Descendre » of a step, of a line and of a group). It
replaces the reordering paragraph of the editor above and the `Editeur-photos`, `-ingredients`, `-etapes-conseil` and `-grands-ecrans` boards on that
point only.

- **Built**: `SortableList`, the `GripButton`, the carried item drawn over the page, « Déposer ici », the drag announcements and instructions, and the
  `grip` strings are deleted; the lists are a plain `ItemList` / `Item` (a layout: grid, scrolling row or stack). **dnd-kit is no longer a
  dependency** ([frontend-stack.md](frontend-stack.md)). Nothing in the editor catches a finger any more, so the page scrolls freely over the lists.
- **What stays**: the arrows' announcement (« Photo 2 déplacée en position 1 sur 2 »), the focus that follows a moved item, the numbering by rank, the
  disabled arrows at the ends, a line that never leaves its group. The hint under the cover photos reads as the board has it: « Touche les flèches
  pour changer l’ordre. La première est la couverture. ». The `grip` icon stays in the icon set (as `heart` and `share` do), used by nothing.
- **Not touched**: the ingredient line is two lines on a phone and a tablet and one line on a desktop, as it already was. The boards' other open points
  (« le petit conseil » against « le conseil de la cuisinière ») are the earlier questions, left as they are.

### R8 · the recipe cards as small sliders (`Retouche-8-miniatures-slider`)

A recipe with **several photos** shows them on its card as a small slider; with one photo or none, the card is what it was. It needed the back end:
**the summary of a recipe now lists `coverMediaIds`** (every cover picture, in order; `coverMediaId` is still the first).

- **What is drawn**: under the photo a pill of dots (one per photo, the filled one is the photo shown) and, top right, a dark counter « 1 / 3 ». Both
  are decoration (`aria-hidden`). On a phone and a tablet the photos **follow the finger** sideways and the next one takes over on release (a fifth
  of the photo, 60 px at most, is enough; past the first or the last they give only a third of the way); on a desktop two 44 px arrows appear over
  the photo, halfway down so never over the title, when the pointer is over the card or the card has the focus; ← and → do the same while the card has
  the focus.
- **A tap anywhere still opens the recipe**, the photo included: the card stays one link. The arrows are **beside** the link, over the photo, not in it
  (a button cannot be inside a link), out of the tab order (the keys are the keyboard's way) but named (« Photo précédente », « Photo suivante »). The
  click that ends a drag is swallowed, and the next touch is a tap again.
- **The direction is decided by the first movement** (`useCoverSlider`): sideways is the photo's, up or down is the list's, so a diagonal one goes on
  scrolling the list. A mouse never drags (it would fight with selecting text); `touch-action: pan-y` keeps the page scrolling. **Never automatic.**
- **Each card has its own state** and keeps it while it is on the page; leaving for the recipe and coming back shows the first photo again (the cards
  are rebuilt with the list). The buttons and keys go round the ends; a swipe stops at them.
- **Announced**: a change by a button, a key or a swipe says « Photo 2 sur 3 » in a polite live region of the card.
- **Differences from the board**: the arrows show on the **card's** hover, not only the photo's; the counter's text is 15 px (the `caption` token)
  where the board has 14; the arrows' shadow is a new `stamp-xs` token (2 px). Until the back end that sends `coverMediaIds` runs, the card falls back
  to the first photo.
