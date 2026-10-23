import { mediaUrl } from '../../api/media'
import type { components } from '../../api/schema'
import { paths } from '../../app/paths'

type Schemas = components['schemas']

/** The card shows « one or two » categories and three tags: more would break the rows' alignment. */
const MAX_CATEGORIES = 2
const MAX_TAGS = 3

/** What a recipe card shows, resolved from the API's summary: the card itself knows no URL and no schema. */
export interface RecipeCardModel {
  id: string
  /** The recipe's page. */
  path: string
  title: string
  /** The thumbnail of the first cover picture; none for a recipe without a photo. */
  coverUrl: string | undefined
  categories: readonly string[]
  tags: readonly string[]
  /** Tags beyond the ones shown: « +2 ». */
  hiddenTagCount: number
  author: string | undefined
  /** ISO date-time. */
  createdAt: string | undefined
}

function nonEmpty(text: string | undefined): string | undefined {
  return text === '' ? undefined : text
}

function namesOf(items: readonly { name?: string }[] | undefined): string[] {
  return (items ?? []).flatMap((item) => (item.name ? [item.name] : []))
}

/**
 * The card of a summary, or nothing when the summary lacks what a card cannot do without. The
 * generated types make every field optional; a recipe with no id or title cannot be linked or named.
 */
export function toRecipeCard(
  summary: Schemas['RecipeSummaryResponse'],
): RecipeCardModel | undefined {
  const { id, title } = summary
  if (!id || !title) return undefined

  const tags = namesOf(summary.tags)
  return {
    id,
    path: paths.recipe(id),
    title,
    coverUrl: summary.coverMediaId ? mediaUrl(summary.coverMediaId, 'thumbnail') : undefined,
    categories: namesOf(summary.categories).slice(0, MAX_CATEGORIES),
    tags: tags.slice(0, MAX_TAGS),
    hiddenTagCount: Math.max(0, tags.length - MAX_TAGS),
    author: nonEmpty(summary.author?.username),
    createdAt: summary.createdAt,
  }
}

/**
 * Every card of the pages loaded so far, in order. A recipe added while the reader was scrolling
 * pushes the one before it onto the next page: it is listed once, where it first appeared.
 */
export function recipeCardsOf(
  pages: readonly Schemas['PageRecipeSummaryResponse'][],
): RecipeCardModel[] {
  const seen = new Set<string>()
  return pages
    .flatMap((page) => page.content ?? [])
    .flatMap((summary) => {
      const card = toRecipeCard(summary)
      if (card === undefined || seen.has(card.id)) return []
      seen.add(card.id)
      return [card]
    })
}
