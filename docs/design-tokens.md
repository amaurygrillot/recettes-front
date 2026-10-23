# Design tokens

Extracted from the Claude Design canvas « Il en reste un peu - Design system »
(https://claude.ai/artifact/F1LCSxWHJTzDJ2qaT9Jxm9) on 2026-10-21. **The canvas is the source of truth**: when it and this
file disagree, the canvas wins, and this file gets corrected in the same change. Read it with the Artifact tool
(`read` with `path: project/<Board>.dc.html`; `project/canvas.json` lists every board).

These values are the Tailwind theme (`src/styles/index.css`, Tailwind's CSS-first `@theme`), not literals scattered
through components. Token names below are the Tailwind names: `bg-butter-300`, `text-ink-700`, `rounded-l`, `shadow-stamp`,
`text-title-2`, `font-title`. The theme **clears Tailwind's default scales** (colors, fonts, text sizes, radii, shadows,
breakpoints, containers), so a value that is not in this file cannot be used by accident. Sizes are written in `rem` so that the
browser's font-size setting scales them; at the default 16 px they equal the canvas' pixel values.

> **Reconciled with the canvas on 2026-10-22**, while building the theme (M2). The canvas won everywhere it disagreed:
> icon stroke is 2.2 (not 2), the set has 49 icons (`mail` and `more` were missing), the skeleton and invalid-field colors,
> two title sizes and the 20 px radius were added, the navigation threshold is confirmed at 1024 px. The remaining open
> question is the « 4 cards on wide screens » below.

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
| `brick-bg` | `#FBE3DC` | Error background (banners, tags) |
| `brick-wash` | `#FFF8F6` | Background of an invalid field (not in the first extraction) |
| `herb` | `#2F6B3A` | Success (5.9:1 on paper-100) |
| `herb-bg` | `#E4EFD8` | Success background |
| `disabled-bg` / `-text` / `-border` | `#EADFC8` / `#7D6D58` / `#B8A98F` | Disabled state |
| `skeleton` | `#EFE3C6` | Loading placeholders, outlined in `paper-300` (not in the first extraction) |

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
| Page title (`text-page-title`, home feed) | Fraunces | 30 / 36 (36 / 42 from 1024 px: `text-page-title-lg`) | 800 |
| Title 3 (recipe card) | Fraunces | 24 / 30 | 700 |
| State title (`text-state-title`, empty states) | Fraunces | 28 / 34 | 700 |
| Dialog title (`text-dialog-title`, error blocks, dialogs) | Fraunces | 26 / 32 | 700 |
| **Step text** (« arm's length ») | Atkinson | 22 / 34 | 400 |
| Body | Atkinson | 18 / 28 | 400 |
| Label, button | Atkinson | 20 / 24 | 700 |
| Detail, metadata | Atkinson | 16 / 22 | 400, ink-700 |
| Annotation | Kalam | 26 / 28 | 400, mustard-700 |
| Small annotation (`text-annotation-sm`, the note under a page title) | Kalam | 24 / 28.8 | 400, mustard-700 |

The state title and the dialog title are drawn on the « Retours et chargement » board between Title 2 and Title 3; they
are probably meant to be one size, to unify when the screens that use them are built. Two more sizes appear on boards that
are not built yet (page-header title 28/34 weight 800): add it with its screen. The sign-in and form titles are `text-page-title-lg` (36/42, 800); the entry screens add `text-auth-state-title` (32/38, 800, for « Regarde ta boîte mail » and the other message screens) and `text-auth-title-lg` (40/46, 800, the sign-in beside its butter panel); `text-annotation-lg` (Kalam 30/33) is the handwritten line of the welcome.

Floor: 15 px, only for navigation labels and captions; nothing clickable or decisive below it. Quantities are bold.
Line length 45–60 characters on mobile, 75 at most on desktop; left-aligned, never justified. No long runs of capitals.

## Spacing, sizes, radii

Base 4 px: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64` (named s1–s8: icon–text, between tags, tag padding, screen margin, card
padding, between cards, between sections, breathing room). They are Tailwind's own spacing steps (`1 · 2 · 3 · 4 · 6 · 8 · 12 ·
16`, i.e. `gap-4` = 16 px), so there is no extra token.

- Touch targets: **56 px minimum, 64 px for the primary action**, at least 12 px between two targets. (Filter chips are
  52 px; the tab bar and every control still keep to the same large-target spirit.)
- Radii: `s` 8 (chips, checkboxes) · `m` 12 (fields, messages) · `l` 16 (buttons, banners) · `frame` 20 (stitched dashed frames) ·
  `xl` 24 (cards, photos, state blocks) · `pill` 999 (tags, tab pills), used as `rounded-m`, `rounded-pill`, …

## Shadows

| Name | Value | Use |
|---|---|---|
| paper | `0 1px 0 rgba(43,29,18,.12), 0 2px 6px rgba(43,29,18,.10)` | Flat items: fields, rows |
| card | `0 2px 0 rgba(43,29,18,.12), 0 8px 20px rgba(43,29,18,.16)` | Recipe cards |
| stamp | `4px 4px 0 #2B1D12` | Buttons, chosen element. **Pressed: no shadow, translated 4 px** |
| stamp-sm | `3px 3px 0 #2B1D12` | The chosen filter chip |
| sheet | `0 16px 36px rgba(43,29,18,.26)` | Panels and dialogs that overlap |
| bar | `0 -2px 6px rgba(43,29,18,.10)` | A bar fixed above the tabs (the recipe's « Cuisiner pas à pas »): the shadow falls upwards |

Components are generally outlined in 2 px ink-900.

## Components, as the boards draw them

What the first extraction did not spell out, read from the `Boutons-champs`, `Retours-chargement`, `Avatar-voir-plus` and
`Logo-bol` boards and built in M2 (`src/components/`):

- **Button.** Large 64 px (label 20 bold) or medium 56 px (18 bold); radius 16; 2 px outline. Four kinds: *primary* (butter-300,
  stamp shadow; hover butter-400; pressed mustard-500, no shadow, translated 4 px), *secondary* (paper-50; hover butter-100; pressed
  butter-200, translated 2 px), *quiet* (transparent, underlined; hover paper-200; pressed paper-300) and *danger* (brick with
  paper-50 text, stamp shadow, only inside a confirmation dialog). Disabled: dashed `disabled-border`, `disabled-bg` (transparent
  for secondary and quiet), `disabled-text`, no shadow, no underline. The « Moyen · 56 » sample on the Boutons-champs board is
  drawn with radius 14 and a 3 px shadow, which no other board uses (the dialog buttons on Retours-chargement are 56 px with
  radius 16 and the 4 px shadow): radius 16 everywhere was kept. Danger has no hover color on the canvas, so none was invented.
- **Focus ring** is 3 px ink-900 everywhere; the offset is 4 px on primary, secondary and danger buttons, 2 px on quiet buttons and
  3 px on chips and fields.
- **Tag** (read-only): 36 px high, radius pill, 1.5 px outline, 16 bold, padding 14 (10 on the icon side). Tones: butter-200 on
  ink, herb on herb-bg, brick on brick-bg, paper-50 on ink. A `paper-200` « Facile » tone and a clock icon (« 35 min ») also
  appear: they stand for data that does not exist (difficulty, prep time) and were not built.
- **Filter chip**: 52 px, radius pill, 2 px ink outline, 18 bold; chosen = butter-300 + tick + `stamp-sm`.
- **Text field**: label above (18 bold), input 56 px, radius 12, 20 px text, border 2 px ink-500 (3 px brick on `brick-wash`
  when invalid, 3 px herb + tick when valid, dashed `disabled-border` on `disabled-bg` when disabled), one message under it
  (16, ink-700; bold brick with an alert icon for an error; bold herb for a success). The password toggle, the textarea with
  counter, the select, the checkbox row and the search pill live on the `Champs-avances` board and come with their screens.
- **Recipe card** (`Carte-accueil`, local to HomeScreen until a second screen needs it): radius 24, 2 px ink, `card` shadow, 4:3
  photo (butter stripes and a cutlery in a cream disc without one), body padding 14 / 18 / 16 and gap 10; category pills 32 px
  (butter-200, bold), tag pills 30 px (paper-50, ink-500 outline), « +N » pill dashed on paper-200; title Fraunces 24 / 30 on at
  most two lines with 60 px reserved; byline 16 / 22 in ink-700. Pressed: butter-100, no shadow, 2 px down.
- **Sheet** (`BottomSheet`): corners `rounded-sheet` (28) on top on a phone, all round and centered from 600 px, 85 % of the screen high at most, `shadow-sheet`, dimmed page `ink-900/58`.
- **Recipe page** (`Fiche-*`): title `recipe-title` (40 / 46, 800) on a phone, `title-display` (48 / 52, 800) on a tablet, `poster` on a
  desktop; ingredient lines and steps in the `step` size (22 / 34); ingredient quantities bold, notes in `label` ink-700; dashed
  `ink-500` rules between lines and steps; `WavyRule` closes the title block. The way back and the author's menu are `IconButton`
  `round` (a cream disc, 2 px ink, `paper` shadow) over the photo; the gallery's arrows are 56 px of the same disc; the counter is an ink
  pill. `Button` `danger-outline` (brick text on paper, 2 px ink) is « Supprimer » beside the title. `.rich-text` (in `index.css`) sets
  the paragraph gap (18), list indents (24) and item gap (8) of what an author wrote.
- **Entry screens** (`AuthFrame`, `Marque-ecrans`, `Compte-*`): band 232 / 250 / 280 px, seal 160 / 196, back pill 52 px (paper-50, 2 px ink, pill); on a tablet and desktop the `bg-calm-stripes` page (butter-100 / 200, 22 px stripes, 135°) and a 520 px card (paper-50, 2 px ink, radius 24, `shadow-sheet`). `StateBadge`: 80 px circle, 3 px outline, butter-200 / herb-bg / brick-bg for neutral, success, error. `PasswordField`: 48 px eye inside the field (transparent; yellow with an ink outline while the password is shown). The text field gained a **note** on its label (« facultatif », 16, ink-700), a **kept rule** (the hint turns bold herb with a tick-circle, the frame unchanged), an **invalid** frame without a message, and a **trailing** slot. A quiet button keeps 12 px at its sides (24 px for the others), so a long underlined sentence still fits on a phone line.
- **Account page** (`Compte-*`): each section is a card (paper-50, 2 px ink, radius 20, `shadow-card`, padding 18 / 16 / 20 and 22 / 24 / 24 from 1024 px, gap 14, title 26 / 32); the identity block has the 96 px avatar and the username in `text-identity-name` (28 / 34, 800); the unsaved mark is a pill (butter-100, 1.5 px ink, 16 bold); the role is a `CardPill` (tag tone for a member, category tone for an administrator). `SectionIndex`: 200 px column, entries 52 px high with a 24 px icon, the current one a butter-300 pill with an ink outline, a dashed rule before what follows (« Se déconnecter »). `Toast`: ink-900, radius 16, a 28 px herb dot with a tick for success, the action in butter-300 underlined, a 48 px close; above the tabs on a phone (112 px from the bottom), bottom right and 420 px wide on a desktop. A row that goes elsewhere is 64 px, paper-50, 2 px ink, radius 16, an icon and a chevron.
- **Create link** (`CreateLink`): the yellow « + », 64 px tall, round alone or extended with « Nouvelle recette ».
- **Skeleton**: `skeleton` color pulsing between opacity 1 and .55 over 1.4 s (no animation under `prefers-reduced-motion`), announced as
  « Chargement… » by one status region, shown only after 300 ms, at most 6 per list.
- **Empty state**: dashed ink-500 frame, radius 24, 176 px ink-line bowl, state title, 18 px text, one 64 px button.
  **Compact size** (`size="compact"`, drawn on `Accueil-etats` for a block among others): padding 20 / 18, gap 12, 140 px bowl,
  title 26 / 32; the error block likewise has a 64 px badge (icon 32) instead of 80 px.
  **Error block**: ink outline, `card` shadow, 80 px brick circle with the warning icon, dialog title, 18 px text, a primary
  and a quiet button. **Error banner**: brick on brick-bg, radius 16, alert icon, bold message, optional 56 px action.
- **Avatar**: 40 / 56 / 64 / 72 / 96 px circle, Fraunces 800 initials at 40 % of the size, 2 px ink outline (3 px and a stamp
  shadow from 96 px). Six color pairs picked from the name; no name = dashed circle with the user icon.
- **Logo**: seal (≥ 160 px), lockup (bowl and name, 32–48 px high), bowl (the plain mound under 40 px, with chopsticks and grains
  above). Tones: color on paper, on-butter, mono. Brick only on paper.

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

> The Navigation board now agrees with the Grid board: the desktop bar starts at 1024 px, « same threshold as the third grid »
> (an earlier version said 840 px). The Grid board draws **3 cards per row** from 1024 px; the « 4 on wide screens » in the table
> above has no source on that board, so check the HomeScreen desktop board when building M5.
>
> Theme names: breakpoints `tablet:` (600 px) and `desktop:` (1024 px), widths `max-w-content` (1152 px) and `max-w-reading`
> (680 px).

The grid is the `page-margins` utility of the theme (16 / 32 / 64 px of margin, content centered at 1152 px, the margins and the
content adding up to the screen up to 1280 px); the shell and the desktop bar both use it. `pb-safe-bar` is the 20 px under the
phone's tabs, more on a device with a home indicator (the viewport is `viewport-fit=cover`).

## Navigation

(Built in M4; the decisions and the divergences between boards are in [design-boards.md](design-boards.md#the-shell-m4).)

Phone: fixed bottom tab bar, icon + label, active tab in butter-300 with outline. Visitor: Accueil, Rechercher, Se
connecter. Logged in: Accueil, Rechercher, Mes recettes, Compte. A floating « + » (yellow) creates a recipe, above the
bar without covering it. No burger menu. The bar must be able to take one more tab later (favorites).

## Icons

Own set, drawn on a 24 px grid: **stroke 2.2** (2.5 for the icon of an active tab, 2 at 48 px), round caps and joins, no fill,
`currentColor`-friendly; filled only for an active state (a favorite, a tick). 20 px dense, **24 px default**, 32 px to stand
out, 48 px in empty states. Names in the canvas (49): home, search, book, user, log-in, log-out, heart, plus, minus, close,
check, edit, trash, share, filter, upload, refresh, grip, chef-hat, bold, italic, list-bullet, list-number, undo, redo,
chevron-left/right/up/down, warning, alert, check-circle, info, clock, users, image, camera, lock, eye, eye-off, cutlery, grid,
leaf, plate, cake, soup, bread, **mail, more**.
**`heart`, `share`, `clock` and `users` exist in the set but their features do not exist yet** (favorites, sharing,
prep time, servings): do not wire them to anything.

The paths are copied from the canvas's `Icones` board into `src/components/Icon/iconShapes.tsx`, rendered by `Icon`.

## Logo

« Sceau et bol »: a round yellow seal with the text « IL EN RESTE · UN PEU » on arcs and a bowl of rice with chopsticks
at the center, plus a horizontal lock-up (bowl + « Il en reste un peu » in Fraunces 800) and a compact mark for the app
icon and favicon. Colors: ink `#2B1D12`, seal `#F6D45A`, bowl and rice `#FFFDF7`, band `#A8321F`. The SVG symbols are in
the canvas (`Main` and `Logo-bol` boards); they were copied into `src/components/Logo/logoShapes.tsx`; ink is always ink-900 and the
parts that change with the tone are painted through CSS variables (`--stamp`, `--bowl`, `--rice`, `--band`) that the `Logo`
component sets. The
favicon is `public/favicon.svg` (the bowl on a butter tile).
