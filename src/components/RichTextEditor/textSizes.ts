import type { TextSize } from './textSize'

/**
 * Where the text goes, which sets its size (the one the page shows it in): an introduction (18/28), a step (22/34),
 * a tip (18/28).
 */
export type RichTextVariant = 'introduction' | 'step' | 'advice'

/** What the size of the field's own text is: a step (22/34) or an introduction and a tip (18/28). */
export type TextBase = 'body' | 'step'

export function baseOf(variant: RichTextVariant): TextBase {
  return variant === 'step' ? 'step' : 'body'
}

interface SizeChoice {
  size: TextSize
  /** The size the choice is written in, in the list (an existing text token). */
  sampleClass: string
  /** « 18 / 28 »: the size and the line height of that text on the recipe's page. */
  metrics: string
}

/**
 * The sizes a field offers, each written in its own size: the sizes of the page's text (see docs/design-boards.md, R3).
 * A step has no larger text than its own.
 */
export const SIZE_CHOICES: Record<TextBase, readonly SizeChoice[]> = {
  step: [
    { size: 'small', sampleClass: 'text-body', metrics: '18 / 28' },
    { size: 'normal', sampleClass: 'text-step', metrics: '22 / 34' },
  ],
  body: [
    { size: 'small', sampleClass: 'text-detail', metrics: '16 / 22' },
    { size: 'normal', sampleClass: 'text-body', metrics: '18 / 28' },
    { size: 'large', sampleClass: 'text-step', metrics: '22 / 34' },
  ],
}
