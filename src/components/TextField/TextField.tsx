import { useId, type ComponentProps, type ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'

export type TextFieldProps = Omit<
  ComponentProps<'input'>,
  'className' | 'id' | 'aria-invalid' | 'aria-describedby'
> & {
  /** Always visible, above the field: a placeholder is never a label. */
  label: string
  /** Said next to the label in a lighter weight (« facultatif »): a field that may stay empty says so. */
  note?: string | undefined
  /** Help shown under the field while there is no error and no success message. */
  hint?: string | undefined
  /** The hint is a rule the value now keeps: it turns green with a tick, the frame stays as it was. */
  hintMet?: boolean | undefined
  /**
   * Replaces the hint and marks the field as invalid. The message is tied to the field with
   * `aria-describedby`; how a failed submission is announced (focus on the first invalid field)
   * is for the form to decide, so the message is not a live region.
   */
  error?: string | undefined
  /** Marks the field as invalid, in its brick frame, without a message of its own (the form says it elsewhere). */
  invalid?: boolean | undefined
  /** Replaces the hint and puts a tick in the field. */
  success?: string | undefined
  /** A control inside the field, at its right end (the password's show / hide button). */
  trailing?: ReactNode
}

type FieldStatus = 'idle' | 'met' | 'error' | 'success'

/** One message at a time under the field: the error wins over the success, which wins over the hint. */
function describeField({
  error,
  invalid,
  success,
  hint,
  hintMet,
}: Pick<TextFieldProps, 'error' | 'invalid' | 'success' | 'hint' | 'hintMet'>): {
  status: FieldStatus
  message: string | undefined
} {
  if (error) return { status: 'error', message: error }
  if (invalid) return { status: 'error', message: undefined }
  if (success) return { status: 'success', message: success }
  if (hint && hintMet) return { status: 'met', message: hint }
  return { status: 'idle', message: hint }
}

const BORDERS: Record<FieldStatus, string> = {
  idle: 'border-2 border-ink-500 bg-paper-50 focus:border-ink-900',
  met: 'border-2 border-ink-500 bg-paper-50 focus:border-ink-900',
  error: 'border-3 border-brick bg-brick-wash',
  success: 'border-3 border-herb bg-paper-50 pr-13',
}

const MESSAGES: Record<FieldStatus, string> = {
  idle: 'text-ink-700',
  met: 'font-bold text-herb',
  error: 'font-bold text-brick',
  success: 'font-bold text-herb',
}

export function TextField({
  label,
  note,
  hint,
  hintMet,
  error,
  invalid,
  success,
  trailing,
  type = 'text',
  ...rest
}: TextFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const { status, message } = describeField({ error, invalid, success, hint, hintMet })

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body font-bold">
        {label}
        {note && (
          <>
            {' '}
            <span className="ml-1 text-detail font-normal text-ink-700">{note}</span>
          </>
        )}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          aria-invalid={status === 'error' ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={classNames(
            'h-14 w-full rounded-m px-4 text-label text-ink-900 placeholder:text-ink-700',
            'disabled-look',
            BORDERS[status],
            trailing !== undefined && 'pr-17',
          )}
          {...rest}
        />
        {status === 'success' && (
          <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-herb">
            <Icon name="check" size={26} strokeWidth={2.8} />
          </span>
        )}
        {trailing !== undefined && <div className="absolute top-1 right-1">{trailing}</div>}
      </div>
      {message && (
        <p
          id={messageId}
          className={classNames('flex items-start gap-2 text-detail', MESSAGES[status])}
        >
          {status === 'error' && <Icon name="alert" size={22} strokeWidth={2.4} />}
          {status === 'met' && <Icon name="check-circle" size={22} strokeWidth={2.4} />}
          {message}
        </p>
      )}
    </div>
  )
}
