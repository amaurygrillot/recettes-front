# Kickoff prompts

Ready-to-paste prompts for new Claude Code sessions in this repository. They are short on purpose: the substance lives
in `CLAUDE.md`, [engineering-standards.md](engineering-standards.md), [setup-plan.md](setup-plan.md) and
[design-tokens.md](design-tokens.md), and the shared rules are written once, below.

## Operating rules (apply to every prompt)

**Mission.** Deliver the milestone or screen **completely and on your own**, to a standard a demanding reviewer would
approve without comment. The priority is clean code and a sound architecture; speed is not.

**Autonomy.**
- Decide yourself everything a competent engineer would decide: names, internal structure, how to split components and
  hooks, how to test, library details inside the chosen stack. Do not ask for permission or present options.
- Write the non-obvious decisions into `docs/` (or `CLAUDE.md` when it is operational guidance) as you make them.
- If something is ambiguous, pick the reading most consistent with the design boards, `CLAUDE.md` and the API contract,
  state the assumption in the final report, and carry on.
- **Stop and ask only when genuinely blocked**: the back end is unreachable or contradicts its contract, a design board
  conflicts with the API in a way that changes what the user sees, or a step would need something outside this repository.
- Work in loops until it is right: write, run lint, build and tests, look at the result in the browser pane, fix, repeat. Do
  not hand back work with a failing check or a known visual discrepancy.
- Use the available review skills on your own diff before finishing (a code review pass and a simplification pass), and apply
  what they find.

**Quality bar.** [engineering-standards.md](engineering-standards.md) is binding, including its **definition of done**:
DRY / KISS / SRP, import boundaries enforced by lint, strict TypeScript without `any` or casts, logic in hooks, one source for
text, tokens and API types, tests through the accessible interface covering every state and failure status, accessibility
checked, no `console.*`, nothing left half-done. When a quality rule and speed conflict, the quality rule wins. If the
existing code does not meet the standard, fix what you touch rather than imitate it.

**Versions.** Latest stable of every dependency, checked with `npm view`, resolving without `--force` or
`--legacy-peer-deps`; record installed versions and any pin in `docs/frontend-stack.md`. Node 26 with npm.

**Boundaries.** Touch only the files of your milestone or screen plus the shared components you genuinely need. Never edit
the design canvas, never edit `recettes-back` (report what it needs instead), never push. Create a feature branch for the
work if you are on `main`.

**Finishing.** Run lint, build and tests; verify in the browser pane at 390, 768 and 1280 px against the boards; update
`docs/` and the « Status » section of `CLAUDE.md`; then **propose** the commit (message explaining the why) and give a short
report: what was built, decisions and assumptions, anything you could not do and why. The user approves commits, so do not
commit without their go-ahead.

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
| Auth and account | Added to the canvas after this table was written: find the registration, forgot-password, reset-password and account boards in `canvas.json`. |

The boards contain sample data (recipe names, « 35 min · 4 personnes · facile ») that the API cannot provide. Treat it as
illustration, never as a requirement.

## Prompt A: skeleton, guardrails, theme and base components (M1 + M2)

> Read `CLAUDE.md`, `docs/engineering-standards.md`, `docs/frontend-stack.md`, `docs/setup-plan.md` and
> `docs/design-tokens.md`, then follow the operating rules in `docs/kickoff-prompt.md`.
>
> Carry out **M1 (skeleton and guardrails)** and **M2 (theme and base components)** of the setup plan, in that order, fully
> and without asking me anything unless you are blocked.
>
> The architecture must be enforced by tooling before the first feature exists: strict TypeScript flags, ESLint with the
> import-boundary rules, the bans (`console.*`, `any`, `dangerouslySetInnerHTML` outside `RichTextView`) and accessibility
> linting, and proof that a deliberate violation fails lint. Choose the TypeScript version as described in
> `docs/frontend-stack.md#versions` and write down what you installed and why.
>
> Verify the canvas and `docs/design-tokens.md` agree before coding; if not, correct the document. Build the theme and the
> base components from the boards (read them; do not invent a style), each with tests for every state and an accessibility
> assertion, plus the development-only `/styleguide` route. Compare it with the boards at 390 px in the browser pane and
> iterate until it matches.

## Prompt B: API client, authentication, router and shell (M3 + M4)

> Read `CLAUDE.md`, `docs/engineering-standards.md`, `docs/frontend-stack.md` and `docs/setup-plan.md`, then follow the
> operating rules in `docs/kickoff-prompt.md`. The skeleton and theme exist.
>
> Carry out **M3 (API client and authentication)** then **M4 (router and shell)** fully and autonomously.
>
> The contract is `../recettes-back/src/main/resources/openapi/openapi.yaml`: generate and commit the types, never write an API
> type by hand, and honour the quirks in `CLAUDE.md`. Design the `api` layer as a clean boundary: a typed client, one error
> mapper turning `problem+json` and status codes into a small discriminated union the screens can switch on, one token
> module, query hooks per resource, and nothing in it that knows about components. Test every status the contract can answer
> with MSW.
>
> Before the manual check, confirm the back end answers on port 8080 with CORS allowing `http://localhost:5173`. If the browser
> blocks a call for CORS, stop and report it; do not work around it in the front.
>
> The shell follows the `Navigation`, `Bouton-flottant-feuille` and `Grille` boards, including the visitor and member
> variants and the 1024 px switch to the top bar. A protected route sends a visitor to the login screen and back afterwards.

## Prompt C: one screen (M5 and after)

> Read `CLAUDE.md`, `docs/engineering-standards.md` and `docs/setup-plan.md`, then follow the operating rules in
> `docs/kickoff-prompt.md`.
>
> Implement **<ScreenName>** at **<route>** completely and autonomously, against the real API. Read every board listed for
> this screen in `docs/kickoff-prompt.md` (phone, tablet, desktop and each state). Reuse components from `src/components`;
> create a new one only when the design needs it, inside the screen's folder first, and promote it when a second screen needs
> it. Keep the screen thin: data through hooks from `src/api`, behaviour in custom hooks, rendering in small components.
>
> Cover loading, success, empty and every error status the endpoint can answer, for the visitor and member variants where they
> differ, and show no data the API does not provide. Write the tests as you go and keep iterating against the boards in the
> browser pane at 390, 768 and 1280 px until nothing differs.
>
> Touch only this screen's folder and the shared components it genuinely needs.

For **HomeScreen**, route `/`, the data comes from `GET /recipes` (newest first, infinite query on `page`/`size`) and the main
categories from `GET /categories` (`categoryType: MAIN`). Tapping a category or the fake search field navigates to
`/rechercher`. It is the quality template for all other screens, so take the extra care that implies.
