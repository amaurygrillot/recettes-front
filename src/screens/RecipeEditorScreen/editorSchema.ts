import { z } from 'zod'
import { readQuantity } from './quantity'
import { strings } from './strings'

/** The limits of the contract (`CreateRecipeRequest`): mirrored here for an early answer. */
export const LIMITS = {
  title: 200,
  groupTitle: 200,
  note: 200,
  altText: 500,
  ingredientName: 100,
} as const

const choiceSchema = z.object({ id: z.string().min(1), label: z.string() })

const photoSchema = z.object({
  mediaId: z.string().min(1),
  altText: z.string().max(LIMITS.altText, strings.errors.altTextTooLong),
})

const lineSchema = z.object({
  ingredient: choiceSchema.nullable().refine((chosen) => chosen !== null, {
    message: strings.errors.ingredientRequired,
  }),
  quantity: z.string().superRefine((typed, context) => {
    const reading = readQuantity(typed)
    if (reading.kind === 'negative') {
      context.addIssue({ code: 'custom', message: strings.errors.quantityNegative })
    } else if (reading.kind === 'invalid') {
      context.addIssue({ code: 'custom', message: strings.errors.quantityInvalid })
    }
  }),
  unitId: z.string(),
  note: z.string().max(LIMITS.note, strings.errors.noteTooLong),
})

const groupSchema = z.object({
  title: z.string().max(LIMITS.groupTitle, strings.errors.groupTitleTooLong),
  lines: z.array(lineSchema).min(1, strings.errors.groupEmpty),
})

const stepSchema = z.object({
  html: z.string().refine((html) => html.trim() !== '', { message: strings.errors.stepEmpty }),
  photos: z.array(photoSchema),
})

/** Everything that makes a recipe acceptable, with what to say when it is not. */
export const editorSchema = z.object({
  title: z.string().superRefine((typed, context) => {
    if (typed.length > LIMITS.title) {
      context.addIssue({ code: 'custom', message: strings.errors.titleTooLong })
    } else if (typed.trim() === '') {
      context.addIssue({ code: 'custom', message: strings.errors.titleRequired })
    }
  }),
  introduction: z.string(),
  categories: z.array(choiceSchema).min(1, strings.errors.categoriesRequired),
  tags: z.array(choiceSchema),
  photos: z.array(photoSchema),
  groups: z.array(groupSchema).min(1, strings.errors.groupsRequired),
  steps: z.array(stepSchema).min(1, strings.errors.stepsRequired),
  advice: z.string(),
})

/**
 * The same shape without the rules: what a draft may hold. A draft is whatever was typed so far (an
 * ingredient not chosen yet, a quantity half written), so it is read with the shape and never the
 * rules, and anything that does not have the shape is not a draft.
 */
export const draftValuesSchema = z.object({
  title: z.string(),
  introduction: z.string(),
  categories: z.array(choiceSchema),
  tags: z.array(choiceSchema),
  photos: z.array(z.object({ mediaId: z.string(), altText: z.string() })),
  groups: z.array(
    z.object({
      title: z.string(),
      lines: z.array(
        z.object({
          ingredient: choiceSchema.nullable(),
          quantity: z.string(),
          unitId: z.string(),
          note: z.string(),
        }),
      ),
    }),
  ),
  steps: z.array(
    z.object({
      html: z.string(),
      photos: z.array(z.object({ mediaId: z.string(), altText: z.string() })),
    }),
  ),
  advice: z.string(),
})
