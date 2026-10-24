import type { ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import type { FieldCounter, FieldStatus } from './fieldStatus'

const MESSAGES: Record<FieldStatus, string> = {
  idle: 'text-ink-700',
  met: 'font-bold text-herb',
  error: 'font-bold text-brick',
  success: 'font-bold text-herb',
}

/** The label above a field, with its « facultatif » beside it when it may stay empty. */
export function FieldLabel({
  htmlFor,
  label,
  note,
}: {
  htmlFor: string
  label: string
  note: string | undefined
}) {
  return (
    <label htmlFor={htmlFor} className="text-body font-bold">
      {label}
      {note && (
        <>
          {' '}
          <span className="ml-1 text-detail font-normal text-ink-700">{note}</span>
        </>
      )}
    </label>
  )
}

/** The counter is silent while there is room, quiet near the limit, bold at it, brick beyond it. */
const SHOWN_FROM = 0.8
const BOLD_FROM = 0.95

function counterLook({ typed, max }: FieldCounter): string | undefined {
  if (typed > max) return 'font-bold text-brick'
  if (typed >= max * BOLD_FROM) return 'font-bold text-ink-900'
  if (typed >= max * SHOWN_FROM) return 'text-ink-700'
  return undefined
}

/** The line under a field: its one message at the left, its counter at the right. Nothing when both are absent. */
export function FieldMessage({
  id,
  status,
  message,
  counter,
  counterLabel,
}: {
  id: string
  status: FieldStatus
  message: string | undefined
  counter: FieldCounter | undefined
  /** Said for the counter: « 172 / 200 ». */
  counterLabel: (typed: number, max: number) => string
}): ReactNode {
  const look = counter === undefined ? undefined : counterLook(counter)
  if (!message && look === undefined) return null

  return (
    <div className="flex items-start justify-between gap-3 text-detail">
      {message ? (
        <p id={id} className={classNames('flex items-start gap-2', MESSAGES[status])}>
          {status === 'error' && <Icon name="alert" size={22} strokeWidth={2.4} />}
          {status === 'met' && <Icon name="check-circle" size={22} strokeWidth={2.4} />}
          {message}
        </p>
      ) : (
        <span />
      )}
      {counter !== undefined && look !== undefined && (
        <p className={classNames('shrink-0', look)}>{counterLabel(counter.typed, counter.max)}</p>
      )}
    </div>
  )
}
