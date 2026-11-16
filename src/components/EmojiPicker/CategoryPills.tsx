import { useEffect, useRef } from 'react'
import { classNames } from '../../lib/classNames'
import { useCanScrollMore } from '../../lib/useCanScrollMore'
import { Emoji } from '../Emoji/Emoji'
import { strings } from './strings'

export interface CategoryPill {
  /** The category, as the data numbers it. */
  index: number
  label: string
}

// The emoji that stands for each group of the data, as the boards draw them (the data numbers the
// groups 0, 1, 3 … 9: 2 is the loose skin tones and hair, which are not emojis).
const ICONS: Readonly<Record<number, string>> = {
  0: '🙂',
  1: '👋',
  3: '🌱',
  4: '🍕',
  5: '🏖️',
  6: '🎉',
  7: '🧪',
  8: '❤️',
  9: '🏁',
}

export interface CategoryPillsProps {
  categories: readonly CategoryPill[]
  /** The category being read. */
  active: number | undefined
  onGo: (category: number) => void
}

/**
 * Shortcuts to the categories of the one long list: they scroll it to a title, and the one of the
 * category being read is marked `aria-current` (these are links to places, not buttons that toggle).
 * One line that scrolls sideways, with a fade where there is more.
 */
export function CategoryPills({ categories, active, onGo }: CategoryPillsProps) {
  const rowRef = useRef<HTMLUListElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)
  const more = useCanScrollMore(rowRef, categories, 'horizontal')

  // The pill of the category being read stays in sight when the list scrolls under it.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [active])

  return (
    <nav aria-label={strings.categories.navigation} className="relative -mx-4">
      <ul ref={rowRef} className="scrollbar-hidden flex gap-2.5 overflow-x-auto px-4 pt-1.5 pb-2">
        {categories.map((category) => {
          const current = category.index === active
          return (
            <li key={category.index} className="flex-none">
              <button
                type="button"
                ref={current ? activeRef : undefined}
                aria-current={current ? 'true' : undefined}
                aria-label={strings.categories.goTo(category.label)}
                onClick={() => {
                  onGo(category.index)
                }}
                className={classNames(
                  'inline-flex h-13 cursor-pointer items-center gap-2 rounded-pill border-2 border-ink-900 pr-4 pl-3 text-body font-bold whitespace-nowrap text-ink-900',
                  current ? 'bg-butter-300 shadow-stamp-sm' : 'bg-paper-50',
                )}
              >
                <Emoji emoji={ICONS[category.index] ?? '🙂'} size="badge" />
                {category.label}
              </button>
            </li>
          )
        })}
      </ul>
      {more && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-paper-50"
        />
      )}
    </nav>
  )
}
