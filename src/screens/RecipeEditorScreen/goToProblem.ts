import type { ProblemAnchor } from './problems'

/** The section each kind of problem is found in; `fields` can be anywhere, so it is looked for in the whole form. */
const SECTION_OF: Record<Exclude<ProblemAnchor, 'fields'>, string> = {
  title: 'informations',
  categories: 'categories',
  ingredients: 'ingredients',
  steps: 'steps',
}

/**
 * Takes the person to a problem of the summary: scrolls to the first field that says it is invalid in
 * that part of the page and puts the focus there. A part that has no field to point at (nothing
 * chosen yet) gets its first control, so the keyboard lands where the work is.
 */
export function goToProblem(anchor: ProblemAnchor): void {
  const region = anchor === 'fields' ? document : document.getElementById(SECTION_OF[anchor])
  const target =
    region?.querySelector<HTMLElement>('[aria-invalid="true"]') ??
    region?.querySelector<HTMLElement>('input, textarea, select, button, [contenteditable="true"]')
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  target?.focus({ preventScroll: true })
}
