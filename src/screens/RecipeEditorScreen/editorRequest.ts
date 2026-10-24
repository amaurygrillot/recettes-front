import type { components } from '../../api/schema'
import type { EditorValues, PhotoValue } from './editorModel'
import { readQuantity } from './quantity'

type Schemas = components['schemas']

function pictureRequest({ mediaId, altText }: PhotoValue): Schemas['RecipePictureRequest'] {
  const description = altText.trim()
  return description === '' ? { mediaId } : { mediaId, altText: description }
}

function ingredientGroups(values: EditorValues): Schemas['RecipeIngredientGroupRequest'][] {
  return values.groups.map((group) => {
    const title = group.title.trim()
    return {
      ...(title === '' ? {} : { title }),
      ingredients: group.lines.flatMap(({ ingredient, quantity, unitId, note }) => {
        if (ingredient === null) return []
        const reading = readQuantity(quantity)
        const written = note.trim()
        return [
          {
            ingredientId: ingredient.id,
            ...(reading.kind === 'number' ? { quantity: reading.value } : {}),
            ...(unitId === '' ? {} : { unitId }),
            ...(written === '' ? {} : { note: written }),
          },
        ]
      }),
    }
  })
}

function steps(values: EditorValues): Schemas['RecipeStepRequest'][] {
  return values.steps.map((step) => ({
    instruction: step.html,
    ...(step.photos.length === 0 ? {} : { pictures: step.photos.map(pictureRequest) }),
  }))
}

/** What the back end is sent to create the recipe: the optional texts only when something is written. */
export function createRequestFrom(values: EditorValues): Schemas['CreateRecipeRequest'] {
  return {
    title: values.title.trim(),
    ...(values.introduction === '' ? {} : { introduction: { text: values.introduction } }),
    ...(values.advice === '' ? {} : { recommendations: values.advice }),
    categoryIds: values.categories.map(({ id }) => id),
    tagIds: values.tags.map(({ id }) => id),
    coverPictures: values.photos.map(pictureRequest),
    ingredientGroups: ingredientGroups(values),
    steps: steps(values),
  }
}

/**
 * What it is sent to change it: the whole form, since an update replaces every collection it
 * carries. An emptied introduction is `{ text: '' }`, which is how the back end is told to remove
 * it (an absent field would leave it as it was), and an emptied tip is an empty text for the same reason.
 */
export function updateRequestFrom(values: EditorValues): Schemas['UpdateRecipeRequest'] {
  return {
    title: values.title.trim(),
    introduction: { text: values.introduction },
    recommendations: values.advice,
    categoryIds: values.categories.map(({ id }) => id),
    tagIds: values.tags.map(({ id }) => id),
    coverPictures: values.photos.map(pictureRequest),
    ingredientGroups: ingredientGroups(values),
    steps: steps(values),
  }
}
