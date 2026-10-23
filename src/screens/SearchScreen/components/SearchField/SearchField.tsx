import { useId, useRef } from 'react'
import { MAX_QUERY_LENGTH } from '../../../../app/searchCriteria'
import { useSearchText } from '../../../../app/useSearchText'
import { Icon } from '../../../../components/Icon/Icon'
import { IconButton } from '../../../../components/IconButton/IconButton'
import { classNames } from '../../../../lib/classNames'
import { strings } from '../../strings'

/**
 * The field of the search page on a phone and a tablet (a desktop searches from the bar): a pill
 * of 56 px, no button, results following a short pause in the typing. At 200 characters the
 * typing stops and the field says so.
 */
export function SearchField() {
  const field = useSearchText()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const atLimit = field.text.length >= MAX_QUERY_LENGTH

  return (
    <form
      role="search"
      aria-label={strings.field.landmark}
      onSubmit={(event) => {
        event.preventDefault()
        field.submit()
      }}
      className="flex min-w-0 flex-1 flex-col gap-1.5"
    >
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          {strings.field.label}
        </label>
        <span className="pointer-events-none absolute top-1/2 left-4.5 -translate-y-1/2 text-ink-900">
          <Icon name="search" size={24} strokeWidth={2.4} />
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          maxLength={MAX_QUERY_LENGTH}
          value={field.text}
          placeholder={strings.field.label}
          aria-invalid={atLimit ? true : undefined}
          onChange={(event) => {
            field.change(event.target.value)
          }}
          className={classNames(
            'h-14 w-full rounded-pill bg-paper-50 pl-13.5 text-label text-ellipsis text-ink-900 placeholder:text-ink-700 focus:border-ink-900',
            field.text === '' ? 'pr-4.5' : 'pr-14',
            atLimit ? 'border-3 border-brick bg-brick-wash' : 'border-2 border-ink-500',
          )}
        />
        {field.text !== '' && (
          <span className="absolute top-1 right-1">
            <IconButton
              label={strings.field.clear}
              icon="close"
              variant="bare"
              size="medium"
              onClick={() => {
                field.clear()
                inputRef.current?.focus()
              }}
            />
          </span>
        )}
      </div>
      {atLimit && (
        <div className="flex justify-between gap-3 px-1 text-detail font-bold text-brick">
          <p>{strings.field.limit(MAX_QUERY_LENGTH)}</p>
          <p>{strings.field.counter(field.text.length, MAX_QUERY_LENGTH)}</p>
        </div>
      )}
    </form>
  )
}
