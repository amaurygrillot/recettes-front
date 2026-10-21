# Kickoff prompts

Ready-to-paste prompts for new Claude Code sessions in this repository. Each one assumes the session has read
`CLAUDE.md`, and tells it where the rest is.

## Canvas boards by screen

The design lives in the Claude Design canvas https://claude.ai/artifact/F1LCSxWHJTzDJ2qaT9Jxm9. List its files, read
`project/canvas.json`, then read only the boards you need with `path: project/<file>`.

| Screen | Boards (files under `project/`) |
|---|---|
| Foundations | `Main` (colors) · `Typographie` · `Fondations` · `Boutons-champs` · `Champs-avances` · `Grille` · `Icones` |
| Shell and components | `Navigation` · `Bouton-flottant-feuille` · `Retours-chargement` · `Avatar-voir-plus` · `Carte-navigation` · `Logo-bol` · `Marque-ecrans` |
| HomeScreen | `Accueil-mobile` · `Accueil-etats` · `Carte-accueil` · `Accueil-tablette` · `Accueil-ordinateur` |
| SearchScreen | `Rechercher-entrees` · `Rechercher-filtres` · `Rechercher-etats` · `Rechercher-mes-recettes` · `Rechercher-tablette` · `Rechercher-ordinateur` |
| RecipeScreen | `Fiche-haut` · `Fiche-corps` · `Fiche-audiences` · `Fiche-etats` · `Fiche-grands-ecrans` |
| CookingScreen | `Pas-a-pas-entree` · `Pas-a-pas-etape` · `Pas-a-pas-fin` · `Pas-a-pas-etats` · `Pas-a-pas-grands-ecrans` |
| RecipeEditorScreen | `Editeur-cadre` · `Editeur-texte-riche` · `Editeur-categories-tags` · `Editeur-photos` · `Editeur-ingredients` · `Editeur-etapes-conseil` · `Editeur-validation` · `Editeur-session-droits` · `Editeur-grands-ecrans` |
| Auth and account | Added to the canvas after this table was written: look for the registration, forgot-password, reset-password and account boards in `canvas.json`. |

The canvas boards contain sample data (recipe names, « 35 min · 4 personnes · facile ») that the API cannot provide.
Treat it as illustration, never as a requirement.

## Prompt A: skeleton and theme (M1 + M2)

> Read `CLAUDE.md`, `docs/frontend-stack.md`, `docs/setup-plan.md` and `docs/design-tokens.md`. Then carry out milestones
> **M1 (skeleton)** and **M2 (theme and base components)** of the setup plan, in that order.
>
> Use npm and Node 26 (pin it in `.nvmrc` and `engines`; if the installed Node is older, tell me instead of downgrading). Install the latest version of every dependency.
> Create the folder layout described in the plan (only the folders you fill). Build the Tailwind theme from
> `docs/design-tokens.md`, self-host the three fonts, and build the base components with tests for every state. Read the
> design boards named in the plan for the exact look; do not invent a style.
>
> Before writing code, check that the canvas and `docs/design-tokens.md` agree on the tokens; if they do not, tell me and
> correct the document. Create `.claude/launch.json` and `.claude/settings.json` as described in M1, and update the
> « Status » section of `CLAUDE.md` so it only lists commands that now exist.
>
> Verify visually: start the dev server in the browser pane and compare the `/styleguide` route with the boards at a 390 px
> viewport. Stop after M2, run lint, build and tests, and **propose** a commit (do not commit).

## Prompt B: API client, authentication, router and shell (M3 + M4)

> Read `CLAUDE.md`, `docs/frontend-stack.md`, `docs/setup-plan.md`. The skeleton and theme are done. Carry out **M3 (API
> client and authentication)** then **M4 (router and shell)**.
>
> The contract is `../recettes-back/src/main/resources/openapi/openapi.yaml`; generate and commit the types, never write an
> API type by hand. Respect the quirks listed in `CLAUDE.md` (text/plain login, problem+json, `Retry-After`, status codes).
> Before M3's manual check, confirm the back end is running on port 8080 with CORS allowing `http://localhost:5173`; if a
> browser call is blocked by CORS, stop and tell me instead of working around it in the front.
>
> The shell follows the `Navigation`, `Bouton-flottant-feuille` and `Grille` boards. Stop after M4, run lint, build and
> tests, and **propose** a commit.

## Prompt C: one screen (M5 and after)

> Read `CLAUDE.md` and `docs/setup-plan.md`. Implement **<ScreenName>** against the real API, at `<route>`.
>
> Read the canvas boards listed for this screen in `docs/kickoff-prompt.md` (all variants: phone, tablet, desktop, and every
> state). Reuse existing components from `src/components`; create new ones only when the design needs them, in the screen's
> own folder first. Use the generated client and TanStack Query hooks in `src/api`. Show every error status the way the
> design and `CLAUDE.md` describe; do not show data the API does not provide.
>
> Write tests for each state (loading, success, empty, error statuses, visitor and member variants where relevant). Check
> the result in the browser pane at 390, 768 and 1280 px against the boards. Run lint, build and tests, update `docs/` if
> you learned something non-obvious, and **propose** a commit.
>
> Touch only this screen's folder and the shared components it genuinely needs.

For **HomeScreen**, route `/`, the data comes from `GET /recipes` (newest first, infinite query on `page`/`size`) and the
main categories from `GET /categories` (`categoryType: MAIN`). Tapping a category or the fake search field navigates to
`/rechercher`.
