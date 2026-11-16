import { EmojiPicker } from 'frimousse'
import { useRef } from 'react'
import { Icon } from '../Icon/Icon'
import { IconButton } from '../IconButton/IconButton'
import { strings } from './strings'

export interface SearchFieldProps {
  value: string
  onChange: (text: string) => void
}

/**
 * The search field of the picker: the look of the system's `SearchPill`, on the picker's own input (it
 * has to be the one the picker listens to, so that the arrows move through the results from it).
 */
export function SearchField({ value, onChange }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative min-w-0 flex-1">
      <span className="pointer-events-none absolute top-1/2 left-4.5 -translate-y-1/2 text-ink-900">
        <Icon name="search" size={24} strokeWidth={2.4} />
      </span>
      <EmojiPicker.Search
        ref={inputRef}
        value={value}
        maxLength={200}
        aria-label={strings.search.label}
        placeholder={strings.search.label}
        onChange={(event) => {
          onChange(event.target.value)
        }}
        className={`h-14 w-full rounded-pill border-2 border-ink-500 bg-paper-50 pl-13.5 text-label text-ellipsis text-ink-900 placeholder:text-ink-700 focus:border-ink-900 ${value === '' ? 'pr-4.5' : 'pr-14'}`}
      />
      {value !== '' && (
        <span className="absolute top-1 right-1">
          <IconButton
            label={strings.search.clear}
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
