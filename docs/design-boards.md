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

- **The boards disagree about the desktop bar.** `Navigation` draws it 84 px tall, tabs on the left, a « Nouvelle recette » button in
  the bar. `Accueil-ordinateur`, `Fiche-grands-ecrans` and `Compte-grands-ecrans` (drawn later) draw it 88 px tall with 64 px side
  padding, the tabs **centered**, a 290 px **search field** in the bar, the account tab with the member's **avatar**, and put
  « + Nouvelle recette » at the top right of the feed instead of in the bar. M4 follows `Navigation` (what was asked), with the bar's
  content aligned to the page grid (64 px) as the screen boards do. **Settled with the user (2026-10-23): keep the `Navigation` version for now**; the search
  field and the avatar are features, to be decided again when building M5 if the home board is to be followed.
- **The extended « + Nouvelle recette »** that `Accueil-mobile` draws at the top of the feed (round once scrolled down, extended
  again on the way up) is not built (settled with the user: deferred to M5): it needs a decision on the accessible name (the FAB board says « Créer une recette », the home
  board labels it « Nouvelle recette », and a visible label must be part of the name) and belongs to the screen that has a feed.
- **The login board asks for an « Adresse e-mail », the API logs in by `username`** (`DatabaseUserDetailsService` finds by
  username only). The stand-in LoginScreen asks for « Nom d'utilisateur ». **Settled with the user (2026-10-23): stay on the username for
  now.** The board's label has to follow (or the back end has to accept an e-mail) when the auth screens are built.
- **Full-screen screens** (no tab bar): login and the other public auth screens, cooking mode, the recipe editor.
- The session-expired dialog text is the board's, minus « Ton brouillon est conservé »: no draft exists before the editor does.
- The filter bottom sheet of `Bouton-flottant-feuille` belongs to SearchScreen, not to the shell.
