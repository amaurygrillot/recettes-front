import { mediaUrl } from '../../api/media'
import type { components } from '../../api/schema'
import type { SliderPhoto } from '../../components/PhotoSlider/PhotoSlider'
import type { ViewerPhoto } from '../../components/PhotoViewer/PhotoViewer'
import { formatLongDate } from '../../lib/formatLongDate'
import { ingredientLine, type IngredientLine } from '../../lib/ingredientLine'

type Schemas = components['schemas']

export interface IngredientGroupView {
  /** Absent for a recipe with one group and no heading. */
  title: string | undefined
  lines: readonly IngredientLine[]
}

/** A step's picture: the small one is shown in the page, the full one in the viewer. */
export interface StepPhoto extends ViewerPhoto {
  thumbnailUrl: string
}

export interface StepView {
  /** Counted from 1. */
  number: number
  /** The step's rich text, as stored. */
  html: string
  photos: readonly StepPhoto[]
}

/** What the recipe page shows, certain of every field the API leaves optional. */
export interface RecipeView {
  id: string
  title: string
  categories: readonly string[]
  tags: readonly string[]
  authorId: string | undefined
  authorName: string | undefined
  addedOn: string | undefined
  /** Only when the recipe was changed on another day than the one it was added. */
  modifiedOn: string | undefined
  introduction: string | undefined
  photos: readonly SliderPhoto[]
  ingredientGroups: readonly IngredientGroupView[]
  steps: readonly StepView[]
  advice: string | undefined
}

/** Whether rich text says anything: an editor that was emptied leaves `<p></p>` behind. */
export function hasText(html: string | null | undefined): html is string {
  if (html === null || html === undefined) return false
  return html.replace(/<[^>]*>|&nbsp;/g, ' ').trim() !== ''
}

function nonBlank(text: string | null | undefined): string | undefined {
  const trimmed = text?.trim()
  return trimmed === undefined || trimmed === '' ? undefined : trimmed
}

function namesOf(items: readonly { name?: string }[] | undefined): string[] {
  return (items ?? []).flatMap((item) => (item.name ? [item.name] : []))
}

/** The pictures of a recipe or of a step, each with its full-size and its thumbnail address. */
function photosOf(pictures: readonly Schemas['RecipePictureResponse'][] | undefined): StepPhoto[] {
  return (pictures ?? []).flatMap(({ mediaId, altText }) =>
    mediaId
      ? [
          {
            id: mediaId,
            url: mediaUrl(mediaId),
            thumbnailUrl: mediaUrl(mediaId, 'thumbnail'),
            alt: altText ?? '',
          },
        ]
      : [],
  )
}

function groupOf(group: Schemas['RecipeIngredientGroupResponse']): IngredientGroupView {
  const lines = (group.ingredients ?? []).flatMap((line) =>
    line.ingredient?.name
      ? [
          ingredientLine({
            name: line.ingredient.name,
            quantity: line.quantity,
            unit: line.unit?.abbreviation ?? line.unit?.name,
            note: line.note,
          }),
        ]
      : [],
  )
  return { title: nonBlank(group.title), lines }
}

/** The page of a recipe, or nothing for a response that has no id or no title (it could not be shown). */
export function toRecipeView(recipe: Schemas['RecipeResponse']): RecipeView | undefined {
  const { id, title } = recipe
  if (!id || !title) return undefined

  const addedOn = recipe.createdAt === undefined ? undefined : formatLongDate(recipe.createdAt)
  const changedOn = recipe.updatedAt === undefined ? undefined : formatLongDate(recipe.updatedAt)
  const introduction = recipe.introduction?.text

  return {
    id,
    title,
    categories: namesOf(recipe.categories),
    tags: namesOf(recipe.tags),
    authorId: recipe.author?.id,
    authorName: recipe.author?.username,
    addedOn,
    modifiedOn: changedOn !== undefined && changedOn !== addedOn ? changedOn : undefined,
    introduction: hasText(introduction) ? introduction : undefined,
    photos: photosOf(recipe.coverPictures),
    ingredientGroups: (recipe.ingredientGroups ?? [])
      .map(groupOf)
      .filter((group) => group.lines.length > 0),
    steps: (recipe.steps ?? [])
      .map((step) => ({ html: step.instruction ?? '', photos: photosOf(step.pictures) }))
      // A step may be only pictures; one with neither words nor a picture says nothing.
      .filter((step) => hasText(step.html) || step.photos.length > 0)
      .map((step, position) => ({ number: position + 1, ...step })),
    advice: hasText(recipe.recommendations) ? recipe.recommendations : undefined,
  }
}
