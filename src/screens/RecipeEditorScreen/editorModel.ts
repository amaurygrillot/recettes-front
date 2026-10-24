import type { components } from '../../api/schema'

type Schemas = components['schemas']

/** A category, a tag or an ingredient that was chosen: its id for the API, its words for the screen. */
export interface Choice {
  id: string
  label: string
}

/** A picture already uploaded (its media id) with the description given for people who cannot see it. */
export interface PhotoValue {
  mediaId: string
  altText: string
}

/** Where the form keeps a list of photos: the recipe's cover, or the photos of one step. */
export type PhotoListName = 'photos' | `steps.${number}.photos`

/** One line of the ingredient list. `quantity` is what was typed (« 1,5 »): it is read when saving. */
export interface LineValue {
  ingredient: Choice | null
  quantity: string
  /** The id of a unit, or `''` for none (« 3 œufs »). */
  unitId: string
  note: string
}

export interface GroupValue {
  /** `''` for the common case of one group without a title. */
  title: string
  lines: LineValue[]
}

export interface StepValue {
  /** The rich text, as the HTML to store. */
  html: string
  photos: PhotoValue[]
}

/** Everything the form edits: the whole recipe, in the shape the form needs it in. */
export interface EditorValues {
  title: string
  /** HTML, `''` for none. */
  introduction: string
  categories: Choice[]
  tags: Choice[]
  photos: PhotoValue[]
  groups: GroupValue[]
  steps: StepValue[]
  /** The cook's tip: HTML, `''` for none. */
  advice: string
}

export function emptyLine(): LineValue {
  return { ingredient: null, quantity: '', unitId: '', note: '' }
}

export function emptyGroup(): GroupValue {
  return { title: '', lines: [emptyLine()] }
}

export function emptyStep(): StepValue {
  return { html: '', photos: [] }
}

/** A blank recipe: nothing chosen, nothing written. */
export function emptyValues(): EditorValues {
  return {
    title: '',
    introduction: '',
    categories: [],
    tags: [],
    photos: [],
    groups: [],
    steps: [],
    advice: '',
  }
}

/**
 * What a new recipe starts from: nothing written, but the places to write the two things every recipe
 * needs, an ingredient in a group without a title and a step, are there already.
 */
export function newRecipeValues(): EditorValues {
  return { ...emptyValues(), groups: [emptyGroup()], steps: [emptyStep()] }
}

/** The French decimal comma, as a quantity is written and read: `1.5` is shown `1,5`. */
export function quantityToText(quantity: number | null | undefined): string {
  return quantity === null || quantity === undefined ? '' : String(quantity).replace('.', ',')
}

/** What the `Choice` of a category says: « Desserts › Tartes » for a subcategory, its own name otherwise. */
export type CategoryLabeller = (category: Schemas['CategoryResponse']) => string

function choicesOf<Item extends { id?: string }>(
  items: readonly Item[] | undefined,
  labelOf: (item: Item) => string,
): Choice[] {
  return (items ?? []).flatMap((item) => (item.id ? [{ id: item.id, label: labelOf(item) }] : []))
}

function photosOf(pictures: readonly Schemas['RecipePictureResponse'][] | undefined): PhotoValue[] {
  return (pictures ?? []).flatMap(({ mediaId, altText }) =>
    mediaId ? [{ mediaId, altText: altText ?? '' }] : [],
  )
}

/** The form's values for a recipe that exists: what editing it starts from. */
export function valuesFromRecipe(
  recipe: Schemas['RecipeResponse'],
  categoryLabel: CategoryLabeller,
): EditorValues {
  return {
    title: recipe.title ?? '',
    introduction: recipe.introduction?.text ?? '',
    categories: choicesOf(recipe.categories, categoryLabel),
    tags: choicesOf(recipe.tags, (tag) => tag.name ?? ''),
    photos: photosOf(recipe.coverPictures),
    groups: (recipe.ingredientGroups ?? []).map((group) => ({
      title: group.title ?? '',
      lines: (group.ingredients ?? []).flatMap((line) =>
        line.ingredient?.id
          ? [
              {
                ingredient: { id: line.ingredient.id, label: line.ingredient.name ?? '' },
                quantity: quantityToText(line.quantity),
                unitId: line.unit?.id ?? '',
                note: line.note ?? '',
              },
            ]
          : [],
      ),
    })),
    steps: (recipe.steps ?? []).map((step) => ({
      html: step.instruction ?? '',
      photos: photosOf(step.pictures),
    })),
    advice: recipe.recommendations ?? '',
  }
}

/** Whether two forms hold the same recipe: what tells a form that was changed from one that was only opened. */
export function sameValues(a: EditorValues, b: EditorValues): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** A line with nothing in it: the one a new group starts with, or one that was added and not filled. */
export function isBlankLine(line: LineValue): boolean {
  return (
    line.ingredient === null &&
    line.quantity.trim() === '' &&
    line.unitId === '' &&
    line.note === ''
  )
}

/** A group with no title and only blank lines: removing it loses nothing, so it is not asked about. */
export function isBlankGroup(group: GroupValue): boolean {
  return group.title.trim() === '' && group.lines.every(isBlankLine)
}
