# Kickoff prompts

Ready-to-paste prompts for new Claude Code sessions in this repository. Nothing else lives in this file. The substance is in
`CLAUDE.md`, [engineering-standards.md](engineering-standards.md), [setup-plan.md](setup-plan.md),
[design-tokens.md](design-tokens.md), [agent-operating-rules.md](agent-operating-rules.md) (how every session works) and
[design-boards.md](design-boards.md) (which canvas boards belong to which screen).

## Prompt A: skeleton, guardrails, theme and base components (M1 + M2)

> Read `CLAUDE.md`, `docs/engineering-standards.md`, `docs/frontend-stack.md`, `docs/setup-plan.md` and
> `docs/design-tokens.md`, then follow `docs/agent-operating-rules.md`.
>
> Carry out **M1 (skeleton and guardrails)** and **M2 (theme and base components)** of the setup plan, in that order, fully
> and without asking me anything unless you are blocked.
>
> The architecture must be enforced by tooling before the first feature exists: strict TypeScript flags, ESLint with the
> import-boundary rules, the bans (`console.*`, `any`, `dangerouslySetInnerHTML` outside `RichTextView`) and accessibility
> linting, and proof that a deliberate violation fails lint. Use the verified versions and the two `overrides` documented in
> `docs/frontend-stack.md#versions` (re-check with `npm view` and write down anything that changed).
>
> Verify the canvas and `docs/design-tokens.md` agree before coding; if not, correct the document. Build the theme and the
> base components from the boards listed in `docs/design-boards.md` (read them; do not invent a style), each with tests for
> every state and an accessibility assertion, plus the development-only `/styleguide` route. Compare it with the boards at
> 390 px in the browser pane and iterate until it matches.

## Prompt B: API client, authentication, router and shell (M3 + M4)

> Read `CLAUDE.md`, `docs/engineering-standards.md`, `docs/frontend-stack.md` and `docs/setup-plan.md`, then follow
> `docs/agent-operating-rules.md`. The skeleton and theme exist.
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
> The shell follows the `Navigation`, `Bouton-flottant-feuille` and `Grille` boards (see `docs/design-boards.md`), including
> the visitor and member variants and the 1024 px switch to the top bar. A protected route sends a visitor to the login screen
> and back afterwards.

## Prompt C: one screen (M5 and after)

Replace `<ScreenName>` and `<route>`. The screen's boards are listed in `docs/design-boards.md`.

> Read `CLAUDE.md`, `docs/engineering-standards.md` and `docs/setup-plan.md`, then follow `docs/agent-operating-rules.md`.
>
> Implement **<ScreenName>** at **<route>** completely and autonomously, against the real API. Read every board listed for
> this screen in `docs/design-boards.md` (phone, tablet, desktop and each state). Reuse components from `src/components`;
> create a new one only when the design needs it, inside the screen's folder first, and promote it when a second screen needs
> it. Keep the screen thin: data through hooks from `src/api`, behaviour in custom hooks, rendering in small components.
>
> Cover loading, success, empty and every error status the endpoint can answer, for the visitor and member variants where they
> differ, and show no data the API does not provide. Write the tests as you go and keep iterating against the boards in the
> browser pane at 390, 768 and 1280 px until nothing differs.
>
> Touch only this screen's folder and the shared components it genuinely needs.

### Screen-specific additions to Prompt C

**HomeScreen**, route `/`: the data comes from `GET /recipes` (newest first, infinite query on `page`/`size`) and the main
categories from `GET /categories` (`categoryType: MAIN`). Tapping a category or the fake search field navigates to
`/rechercher`. It is the quality template for all other screens, so take the extra care that implies.
