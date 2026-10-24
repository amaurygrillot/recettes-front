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
| Auth screens | `Marque-ecrans` (sign-in) · `Compte-inscription` · `Compte-mot-de-passe-oublie` · `Compte-nouveau-mot-de-passe` · `Compte-public-grands-ecrans` |
| AccountScreen | `Compte-page` · `Compte-etats` · `Compte-grands-ecrans` |

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
  steps (7, 653 px of text at most). `PhotoSlider` is the shared gallery: one photo shows no controls, none shows the butter stand-in.
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
full-screen pages (no tabs, no top bar) built on one `AuthFrame`: a butter band with the seal (232 px high, 160 px seal; the sign-in
250 / 196; the welcome 280 / 196) and the way back, « Retour », as a 52 px pill in its corner. From 600 px the band disappears into a
calm striped background (`bg-calm-stripes`, the two palest butters), the seal sits above a centred 520 px card (radius 24, 28 / 32
padding). **The sign-in is the exception from 1024 px**: a 960 px card with the butter panel (300 px seal) beside the form, on the plain
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

- **Six tools, in three groups, and no more**: bold, italic · bulleted list, numbered list · undo, redo. 44 px buttons, `aria-pressed` for the
  tools that are on at the caret (yellow, ink outline), undo and redo dashed while there is nothing to undo or redo. Pressing a tool never takes
  the focus out of the text (`mousedown` is prevented). Ctrl + B, I, Z and Shift + Z work as in any editor.
- **What it refuses**: no heading, quote, underline, link, image or colour. A shortcut for another format is swallowed
  (`FORMAT_TEXT_COMMAND`), a heading or a quote that arrives with a paste becomes a paragraph (node transform), and Tab leaves the field.
- **What it stores** (`htmlConversion.ts`): the HTML is written by hand from the editor's tree, in the viewer's own vocabulary only (`p`, `br`,
  `strong`, `em`, `ul`, `ol`, `li`), with no attribute (Lexical's own export adds styles and classes), without the blank paragraphs and list
  items a stray Enter leaves, and `''` when nothing is written. **What it opens** goes through the same `sanitizeRichText` (DOMPurify) as the
  viewer first, so a script stored in a recipe never gets into the editor either. Both directions are tested against hostile input.
- **The field**: label above (with « facultatif »), a frame like the text fields (2 px ink-500; 2 px ink and a 3 px ring on focus; 3 px brick and a
  rosy background in error), the toolbar in the field's top on a tablet and a desktop. **On a phone, while the text has the focus, the toolbar
  leaves the field and sits on the whole width just above the keyboard** (`useKeyboardInset`, from `visualViewport`); it keeps its place in the
  DOM (so Tab still reaches it) and the field keeps its height (the text does not jump).
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
  recipe itself. Loading, a failure (« Impossible d'ouvrir l'éditeur » with « Réessayer »), a recipe that is not there (`404`, the bowl) and a recipe
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
- **Reordering has three ways everywhere**: the grip (dnd-kit: pointer with a 6 px threshold so a tap on the grip is not a drag, and keyboard, space
  to take, arrows, space to drop), two buttons (arrows on a photo, « Monter » / « Descendre » on a group, a line and a step), and French
  announcements for both. After a button moved an item the focus follows it. Photos and steps are numbered by rank, so reordering renumbers.
  A line stays in its group (no drag between groups, as the board says). The lifted item is drawn tilted over the page and its place says
  « Déposer ici »; **there is no drop animation** (it waits for an animation frame, which a hidden tab or `prefers-reduced-motion` never gives).
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
- **A step** (`Cooking`): the top (« Quitter », the title on up to two lines, « Étape 3 sur 8 » and the progress), the stamp (`StepNumber` with its word: brick,
  104 px, tilted), the instruction in the 22/34 text (`RichTextView`, sanitised like everywhere), the photos, a full-width « Ingrédients » row, and the
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
