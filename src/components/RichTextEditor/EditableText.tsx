import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import type { KeyboardEvent } from 'react'
import { classNames } from '../../lib/classNames'
import type { RichTextVariant } from './textSizes'

const VARIANTS: Record<RichTextVariant, { height: string; text: string }> = {
  introduction: { height: 'min-h-36', text: 'text-body' },
  step: { height: 'min-h-40', text: 'text-step' },
  advice: { height: 'min-h-28', text: 'text-body' },
}

export interface EditableTextProps {
  variant: RichTextVariant
  labelId: string
  placeholder: string
  /** The id of the hint or error under the field, which describes the text. */
  messageId: string | undefined
  invalid: boolean
  /** In the writing mode the text fills the screen, with no height of its own. */
  fill?: boolean
  /** A tap or a click on the text. */
  onTap?: (() => void) | undefined
  onKeyDown?: ((event: KeyboardEvent) => void) | undefined
}

/** The editable text of a field: the same one inline and in the writing mode, which is where the editor is moved to. */
export function EditableText({
  variant,
  labelId,
  placeholder,
  messageId,
  invalid,
  fill = false,
  onTap,
  onKeyDown,
}: EditableTextProps) {
  const advice = variant === 'advice' && !fill
  const { height, text } = VARIANTS[variant]
  const size = classNames(text, !fill && height)

  return (
    <div className={classNames('relative', fill && 'min-h-full')}>
      <ContentEditable
        aria-labelledby={labelId}
        aria-multiline
        aria-invalid={invalid ? true : undefined}
        aria-describedby={messageId}
        aria-placeholder={placeholder}
        onClick={onTap}
        onKeyDown={onKeyDown}
        placeholder={
          <div
            aria-hidden="true"
            className={classNames(
              'pointer-events-none absolute top-0 left-0 text-ink-700',
              advice ? 'px-0.5 py-0.5' : 'px-4 py-3.5',
              size,
            )}
          >
            {placeholder}
          </div>
        }
        className={classNames(
          'rich-text text-ink-900 outline-none',
          advice ? 'px-0.5 pt-0.5 pb-2.5' : 'px-4 py-3.5',
          fill && 'min-h-full',
          size,
        )}
      />
    </div>
  )
}
