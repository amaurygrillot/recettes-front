import type { KeyboardEvent } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import { IconButton } from '../IconButton/IconButton'

export interface SearchLauncherProps {
  /** What the field is for, and what it says while empty: « Chercher une recette ». */
  label: string
  /** The word being searched, shown in place of the label (on the results page); empty otherwise. */
  value?: string
  /** Opens the search. `firstKey` is the printable key that was typed on the button, to carry into the search's own field. */
  onOpen: (firstKey?: string) => void
  /** On the results page: the cross that clears the word in place, without opening anything. */
  clear?: { label: string; onClear: () => void }
}

/**
 * A search field that does not search: a button that looks like the field and opens the search over the page. A
 * printable key typed on it opens the search with that key already written, so nothing typed is lost.
 */
export function SearchLauncher({ label, value = '', onOpen, clear }: SearchLauncherProps) {
  const hasValue = value !== ''

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    // A space and Enter press the button; shortcuts (Ctrl+A, Cmd+C…) and the keys that move the focus are not typing.
    // AltGr reports Ctrl+Alt on Windows, and types « @ » or « € » on many keyboards: it is typing.
    const printable = event.key.length === 1 && event.key !== ' '
    const altGraph = event.getModifierState('AltGraph')
    const shortcut = event.metaKey || ((event.ctrlKey || event.altKey) && !altGraph)
    if (!printable || shortcut) return
    event.preventDefault()
    onOpen(event.key)
  }

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        // The visible word alone would not say what the button does.
        aria-label={hasValue ? `${label} : ${value}` : undefined}
        aria-haspopup="dialog"
        onClick={() => {
          onOpen()
        }}
        onKeyDown={onKeyDown}
        className={classNames(
          'flex h-14 w-full cursor-pointer items-center gap-3 rounded-pill border-2 border-ink-500 bg-paper-50 pl-4.5 text-left text-label focus-visible:outline-offset-2 active:border-ink-900',
          hasValue && clear ? 'pr-14' : 'pr-4.5',
        )}
      >
        <span className="flex-none text-ink-900">
          <Icon name="search" size={24} strokeWidth={2.4} />
        </span>
        <span
          className={classNames('min-w-0 truncate', hasValue ? 'text-ink-900' : 'text-ink-700')}
        >
          {hasValue ? value : label}
        </span>
      </button>
      {hasValue && clear && (
        <span className="absolute top-1 right-1">
          <IconButton
            label={clear.label}
            icon="close"
            variant="bare"
            size="medium"
            onClick={clear.onClear}
          />
        </span>
      )}
    </div>
  )
}
