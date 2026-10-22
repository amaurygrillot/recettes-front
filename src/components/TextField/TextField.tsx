import { useId, type ComponentProps } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'

export type TextFieldProps = Omit<
  ComponentProps<'input'>,
  'className' | 'id' | 'aria-invalid' | 'aria-describedby'
> & {
  /** Always visible, above the field: a placeholder is never a label. */
  label: string
  /** Help shown under the field while there is no error and no success message. */
  hint?: string | undefined
  /**
   * Replaces the hint and marks the field as invalid. The message is tied to the field with
   * `aria-describedby`; how a failed submission is announced (focus on the first invalid field)
   * is for the form to decide, so the message is not a live region.
   */
  error?: string | undefined
  /** Replaces the hint and puts a tick in the field. */
  success?: string | undefined
}

type FieldStatus = 'idle' | 'error' | 'success'

/** One message at a time under the field: the error wins over the success, which wins over the hint. */
function describeField(
  error: string | undefined,
  success: string | undefined,
  hint: string | undefined,
): { status: FieldStatus; message: string | undefined } {
  if (error) return { status: 'error', message: error }
  if (success) return { status: 'success', message: success }
  return { status: 'idle', message: hint }
}

const BORDERS: Record<FieldStatus, string> = {
  idle: 'border-2 border-ink-500 bg-paper-50 focus:border-ink-900',
  error: 'border-3 border-brick bg-brick-wash',
  success: 'border-3 border-herb bg-paper-50 pr-13',
}

export function TextField({ label, hint, error, success, type = 'text', ...rest }: TextFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const { status, message } = describeField(error, success, hint)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body font-bold">
        {label}
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
          )}
          {...rest}
        />
        {status === 'success' && (
          <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-herb">
            <Icon name="check" size={26} strokeWidth={2.8} />
          </span>
        )}
      </div>
      {message && (
        <p
          id={messageId}
          className={classNames(
            'flex items-start gap-2 text-detail',
            status === 'idle' && 'text-ink-700',
            status === 'error' && 'font-bold text-brick',
            status === 'success' && 'font-bold text-herb',
          )}
        >
          {status === 'error' && <Icon name="alert" size={22} strokeWidth={2.4} />}
          {message}
        </p>
      )}
    </div>
  )
}
