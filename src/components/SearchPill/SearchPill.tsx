import { useId, useRef } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import { IconButton } from '../IconButton/IconButton'

export interface SearchPillProps {
  /** Names the field, and is its placeholder: « Chercher une catégorie ». */
  label: string
  value: string
  onChange: (text: string) => void
  /** The name of the cross that appears once something is typed: « Effacer la recherche ». */
  clearLabel: string
  maxLength?: number
  /** Puts the pill in its brick frame (the typing has reached its limit). */
  invalid?: boolean
}

/**
 * The search field of the system: a 56 px pill with a magnifying glass, and a cross to start over
 * that takes the focus back to the field. It is only the field: what typing does is the page's.
 */
export function SearchPill({
  label,
  value,
  onChange,
  clearLabel,
  maxLength,
  invalid = false,
}: SearchPillProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <span className="pointer-events-none absolute top-1/2 left-4.5 -translate-y-1/2 text-ink-900">
        <Icon name="search" size={24} strokeWidth={2.4} />
      </span>
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        maxLength={maxLength}
        value={value}
        placeholder={label}
        aria-invalid={invalid ? true : undefined}
        onChange={(event) => {
          onChange(event.target.value)
        }}
        className={classNames(
          'h-14 w-full rounded-pill bg-paper-50 pl-13.5 text-label text-ellipsis text-ink-900 placeholder:text-ink-700 focus:border-ink-900',
          value === '' ? 'pr-4.5' : 'pr-14',
          invalid ? 'border-3 border-brick bg-brick-wash' : 'border-2 border-ink-500',
        )}
      />
      {value !== '' && (
        <span className="absolute top-1 right-1">
          <IconButton
            label={clearLabel}
            icon="close"
            variant="bare"
            size="medium"
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
          />
        </span>
      )}
    </div>
  )
}
