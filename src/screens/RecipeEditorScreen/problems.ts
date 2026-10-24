import type { EditorValues } from './editorModel'
import { editorSchema } from './editorSchema'
import { strings } from './strings'

/** Where a problem is found: the part of the page to go to when its link in the summary is pressed. */
export type ProblemAnchor = 'title' | 'categories' | 'ingredients' | 'steps' | 'fields'

/** `missing`: something required is absent. `fix`: something is there but cannot be accepted. */
export interface Problem {
  anchor: ProblemAnchor
  kind: 'missing' | 'fix'
  /** In the sentence of the summary: « une catégorie ». */
  label: string
  /** On the link: « Aller aux catégories ». */
  link: string
}

const { summary } = strings

const MISSING_TITLE: Problem = {
  anchor: 'title',
  kind: 'missing',
  label: summary.title,
  link: summary.goTo.title,
}
const LONG_TITLE: Problem = { ...MISSING_TITLE, kind: 'fix', label: summary.longTitle }
const MISSING_CATEGORY: Problem = {
  anchor: 'categories',
  kind: 'missing',
  label: summary.category,
  link: summary.goTo.categories,
}
const MISSING_INGREDIENT: Problem = {
  anchor: 'ingredients',
  kind: 'missing',
  label: summary.ingredient,
  link: summary.goTo.ingredients,
}
const INGREDIENT_TO_FIX: Problem = {
  ...MISSING_INGREDIENT,
  kind: 'fix',
  label: summary.ingredientToFix,
}
const MISSING_STEP: Problem = {
  anchor: 'steps',
  kind: 'missing',
  label: summary.step,
  link: summary.goTo.steps,
}
const STEP_TO_WRITE: Problem = { ...MISSING_STEP, kind: 'fix', label: summary.stepToWrite }
const FIELD_TO_FIX: Problem = {
  anchor: 'fields',
  kind: 'fix',
  label: summary.fieldToFix,
  link: summary.goTo.fields,
}

/** What an issue of the schema is, from where it is (`['groups', 0, 'lines', 1, 'ingredient']`) and what it says. */
function problemAt(path: readonly PropertyKey[], message: string): Problem {
  const [section, , part, , field] = path
  if (section === 'title')
    return message === strings.errors.titleRequired ? MISSING_TITLE : LONG_TITLE
  if (section === 'categories') return MISSING_CATEGORY
  if (section === 'groups') {
    // No group at all, or a group without a line: an ingredient is missing.
    if (path.length <= 1 || (part === 'lines' && path.length === 3)) return MISSING_INGREDIENT
    return part === 'lines' && field === 'ingredient' ? INGREDIENT_TO_FIX : FIELD_TO_FIX
  }
  if (section === 'steps') {
    if (path.length <= 1) return MISSING_STEP
    return part === 'html' ? STEP_TO_WRITE : FIELD_TO_FIX
  }
  return FIELD_TO_FIX
}

/** The five sections of the form, as the index names them. */
export type SectionId = 'informations' | 'photos' | 'ingredients' | 'steps' | 'advice'

/** The section of the form a field is in, from where it is (`['steps', 0, 'photos', 1, 'altText']`). */
function sectionOf(path: readonly PropertyKey[]): SectionId {
  switch (path[0]) {
    case 'photos':
      return 'photos'
    case 'groups':
      return 'ingredients'
    case 'steps':
      return 'steps'
    case 'advice':
      return 'advice'
    default:
      return 'informations'
  }
}

const PAGE_ORDER: readonly ProblemAnchor[] = [
  'title',
  'categories',
  'fields',
  'ingredients',
  'steps',
]

/** What stops the recipe from being saved: one entry per kind of thing, in the order of the page. */
export function problemsOf(values: EditorValues): Problem[] {
  const result = editorSchema.safeParse(values)
  if (result.success) return []

  const found = new Map<string, Problem>()
  for (const issue of result.error.issues) {
    const problem = problemAt(issue.path, issue.message)
    if (!found.has(problem.label)) found.set(problem.label, problem)
  }
  return [...found.values()].sort(
    (a, b) => PAGE_ORDER.indexOf(a.anchor) - PAGE_ORDER.indexOf(b.anchor),
  )
}

/** « Il manque 2 choses : une catégorie, une étape. » (or what is left to correct when nothing is missing). */
export function summaryText(problems: readonly Problem[]): string {
  const things = problems.map(({ label }) => label).join(', ')
  return problems.every(({ kind }) => kind === 'missing')
    ? summary.missing(problems.length, things)
    : summary.toFix(problems.length, things)
}

/** How many things are wrong in each section, said the way the summary counts them: a kind of defect counts once. */
export function problemCounts(values: EditorValues): Partial<Record<SectionId, number>> {
  const result = editorSchema.safeParse(values)
  if (result.success) return {}

  const kinds = new Map<SectionId, Set<string>>()
  for (const issue of result.error.issues) {
    const section = sectionOf(issue.path)
    const { label } = problemAt(issue.path, issue.message)
    kinds.set(section, (kinds.get(section) ?? new Set<string>()).add(label))
  }
  return Object.fromEntries([...kinds].map(([section, labels]) => [section, labels.size]))
}
