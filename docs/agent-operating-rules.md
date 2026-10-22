# Agent operating rules

The rules every agent session follows in this repository, whatever the task. The prompts in
[kickoff-prompt.md](kickoff-prompt.md) point here instead of repeating them.

**Mission.** Deliver the milestone or screen **completely and on your own**, to a standard a demanding reviewer would
approve without comment. The priority is clean code and a sound architecture; speed is not.

## Autonomy

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

## Quality bar

[engineering-standards.md](engineering-standards.md) is binding, including its **definition of done**: DRY / KISS / SRP,
import boundaries enforced by lint, strict TypeScript without `any` or casts, logic in hooks, one source for text, tokens and
API types, tests through the accessible interface covering every state and failure status, accessibility checked, no
`console.*`, nothing left half-done. When a quality rule and speed conflict, the quality rule wins. If the existing code
does not meet the standard, fix what you touch rather than imitate it.

## Versions

Latest stable of every dependency, checked with `npm view`, resolving without `--force` or `--legacy-peer-deps`. The verified
set and the reasons for each pin are in [frontend-stack.md](frontend-stack.md#versions); record installed versions and any new
pin there. Node 26 with npm.

## Boundaries

Touch only the files of your milestone or screen plus the shared components you genuinely need. Never edit the design
canvas, never edit `recettes-back` (report what it needs instead), never push. Create a feature branch for the work if you
are on `main`.

## Finishing

Run lint, build and tests; verify in the browser pane at 390, 768 and 1280 px against the boards; update `docs/` and the
« Status » section of `CLAUDE.md`; then **propose** the commit (message explaining the why) and give a short report: what was
built, decisions and assumptions, anything you could not do and why. The user approves commits, so do not commit without
their go-ahead.
