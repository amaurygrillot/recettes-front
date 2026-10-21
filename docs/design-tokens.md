# Design tokens

Extracted from the Claude Design canvas « Il en reste un peu - Design system »
(https://claude.ai/artifact/F1LCSxWHJTzDJ2qaT9Jxm9) on 2026-10-21. **The canvas is the source of truth**: when it and this
file disagree, the canvas wins, and this file gets corrected in the same change. Read it with the Artifact tool
(`read` with `path: project/<Board>.dc.html`; `project/canvas.json` lists every board).

These values are meant to become the Tailwind theme (`src/styles/index.css`, Tailwind's CSS-first `@theme`), not literals
scattered through components. Token names below are the proposed Tailwind names.

## Identity in one paragraph

Warm, handcrafted, butter-yellow dominant on cream paper with brown « ink ». Yellow is a flat fill that frames the photo,
never a gradient and never alone: it is always outlined in ink (yellow on paper is 1.3:1). Text on yellow is always
ink-900 or ink-700. Details feel hand-made (double rules, stitched dashed frames, tilted stamps) but **at most one per
screen**. The app name is « Il en reste un peu ».

## Colors

| Token | Hex | Role |
|---|---|---|
| `butter-100` | `#FFF3C4` | Soft backgrounds, card hover |
| `butter-200` | `#FBE594` | Tag background, highlights |
| `butter-300` | `#F6D45A` | **Primary**: buttons, active tab |
| `butter-400` | `#EDBE2F` | Button hover |
| `mustard-500` | `#D9A316` | Button pressed, banners |
| `mustard-600` | `#8C6409` | Yellow readable on paper (4.9:1) |
| `mustard-700` | `#6B4A06` | Handwritten accents |
| `paper-50` | `#FFFDF7` | Cards, fields, sheets |
| `paper-100` | `#FBF5E6` | **App background** |
| `paper-200` | `#F3E9D0` | Bands, recessed areas |
| `paper-300` | `#E6D8B8` | Decorative rules, separators |
| `ink-500` | `#8F7660` | Field borders, icons — never text (3.9:1) |
| `ink-700` | `#6B4F3A` | Secondary text (6.9:1 on paper-100) |
| `ink-800` | `#432E1E` | Lead text, navigation bar |
| `ink-900` | `#2B1D12` | **Main text, outlines, focus ring** (15:1) |
| `brick` | `#A8321F` | Error, stamps (6.1:1 on paper-100) |
| `brick-bg` | `#FBE3DC` | Error background |
| `herb` | `#2F6B3A` | Success (5.9:1 on paper-100) |
| `herb-bg` | `#E4EFD8` | Success background |
| `disabled-bg` / `-text` / `-border` | `#EADFC8` / `#7D6D58` / `#B8A98F` | Disabled state |

Measured contrasts that matter: ink-900 on butter-300 11.2:1, ink-900 on paper-100 15:1, ink-700 on butter-300 5.2:1,
ink-900 on mustard-500 7.1:1, mustard-600 on paper-100 4.9:1. **ink-500 is for borders and icons only, never text.**

States: error uses `brick` text/border on `brick-bg`, success `herb` on `herb-bg`. Disabled is recognisable without color
(dashed border, dimmed text). **Focus ring: 3 px solid ink-900, offset 3 px**, visible on cream and on yellow.

## Typography

| Family | Use | Weights | Rule |
|---|---|---|---|
| **Fraunces** (serif) | Titles | 500, 700, 800 | 24 px and up only |
| **Atkinson Hyperlegible** | Body, labels, quantities, steps | 400, 700 | Everything else |
| **Kalam** (handwritten) | Annotations, stamps, small ornaments | 400 | 24 px minimum; never an instruction, a quantity or on yellow |

Loaded from Google Fonts in the canvas; self-host them in the app (no third-party request at runtime).

| Role | Font | Size / line | Weight |
|---|---|---|---|
| Poster (« Mes recettes ») | Fraunces | 52 / 56 | 800 |
| Title 1 (recipe name) | Fraunces | 40 / 46 | 700 (800 in the phone mock-up) |
| Title 2 (section) | Fraunces | 30 / 36 | 700 |
| Title 3 (recipe card) | Fraunces | 24 / 30 | 700 |
| **Step text** (« arm's length ») | Atkinson | 22 / 34 | 400 |
| Body | Atkinson | 18 / 28 | 400 |
| Label, button | Atkinson | 20 / 24 | 700 |
| Detail, metadata | Atkinson | 16 / 22 | 400, ink-700 |
| Annotation | Kalam | 26 / 28 | 400, mustard-700 |

Floor: 15 px, only for navigation labels and captions; nothing clickable or decisive below it. Quantities are bold.
Line length 45–60 characters on mobile, 75 at most on desktop; left-aligned, never justified. No long runs of capitals.

## Spacing, sizes, radii

Base 4 px: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64` (named s1–s8: icon–text, between tags, tag padding, screen margin, card
padding, between cards, between sections, breathing room).

- Touch targets: **56 px minimum, 64 px for the primary action**, at least 12 px between two targets. (Filter chips are
  52 px; the tab bar and every control still keep to the same large-target spirit.)
- Radii: `8` (chips, checkboxes) · `12` (fields, messages) · `16` (buttons) · `24` (cards, photos) · `999` (tags, tab pills).

## Shadows

| Name | Value | Use |
|---|---|---|
| paper | `0 1px 0 rgba(43,29,18,.12), 0 2px 6px rgba(43,29,18,.10)` | Flat items: fields, rows |
| card | `0 2px 0 rgba(43,29,18,.12), 0 8px 20px rgba(43,29,18,.16)` | Recipe cards |
| stamp | `4px 4px 0 #2B1D12` | Buttons, chosen element. **Pressed: no shadow, translated 4 px** |
| sheet | `0 16px 36px rgba(43,29,18,.26)` | Panels and dialogs that overlap |

Components are generally outlined in 2 px ink-900.

## Hand-made details (one per screen, not ten)

Double rule `4px double ink-900` for headers and footers; stitched dashed rule `2px dashed ink-500` between blocks; wavy
rule for the end of a section; stitched dashed frame for notes (`paper-50`, dashed `ink-500`, radius 20); tilted brick
stamps (« NOUVEAU », « testé et approuvé », −8° to 8°), information only, never a button; photo frame with radius 24
and a 2 px ink outline, nothing drawn over it.

## Layout grid

| Range | Columns | Gutter | Side margin | Recipe cards per row |
|---|---|---|---|---|
| Phone, up to 599 px (design at 390) | 4 | 16 | 16 | 1 |
| Tablet, 600–1023 px (design at 768) | 8 | 24 | 32 | 2 |
| Desktop, 1024 px and up (design at 1280) | 12 | 24 | 64 | 3 (4 on wide screens) |

Content stops at **1152 px** and stays centered. Reading column (steps, long text): **680 px at most**. An element spans
4, 8 or 12 columns (or a divisor), never an odd count. The navigation is a bottom tab bar up to 1023 px and a horizontal
top bar from 1024 px.

> Check: an earlier version of the Navigation board said the desktop bar starts at 840 px. The Grid board (current)
> says 1024 px, « same threshold as the third grid ». Use 1024 and confirm against the canvas when building the shell.

## Navigation

Phone: fixed bottom tab bar, icon + label, active tab in butter-300 with outline. Visitor: Accueil, Rechercher, Se
connecter. Logged in: Accueil, Rechercher, Mes recettes, Compte. A floating « + » (yellow) creates a recipe, above the
bar without covering it. No burger menu. The bar must be able to take one more tab later (favorites).

## Icons

Own set, drawn on a 24 px grid: `stroke-width 2`, round caps and joins, no fill, `currentColor`-friendly. Names in the
canvas: home, search, book, user, log-in, log-out, heart, plus, minus, close, check, edit, trash, share, filter, upload,
refresh, grip, chef-hat, bold, italic, list-bullet, list-number, undo, redo, chevron-left/right/up/down, warning, alert,
check-circle, info, clock, users, image, camera, lock, eye, eye-off, cutlery, grid, leaf, plate, cake, soup, bread.
**`heart`, `share`, `clock` and `users` exist in the set but their features do not exist yet** (favorites, sharing,
prep time, servings): do not wire them to anything.

Copy the SVG paths from the canvas's `Icones` board into a single `Icon` component.

## Logo

« Sceau et bol »: a round yellow seal with the text « IL EN RESTE · UN PEU » on arcs and a bowl of rice with chopsticks
at the center, plus a horizontal lock-up (bowl + « Il en reste un peu » in Fraunces 800) and a compact mark for the app
icon and favicon. Colors: ink `#2B1D12`, seal `#F6D45A`, bowl and rice `#FFFDF7`, band `#A8321F`. The SVG symbols are in
the canvas (`Main` and `Logo-bol` boards); copy them into a `Logo` component rather than redrawing them.
