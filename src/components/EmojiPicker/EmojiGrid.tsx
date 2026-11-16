import {
  EmojiPicker,
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
} from 'frimousse'
import { createContext, useContext, type ComponentProps } from 'react'
import { classNames } from '../../lib/classNames'
import { Emoji } from '../Emoji/Emoji'

// The emoji already chosen is marked in the grid; the picker's components cannot take props, so it comes by context.
const ChosenEmoji = createContext<string | undefined>(undefined)

/**
 * One emoji: a 56 px cell, named in French (the picker gives it its `aria-label`), drawn by Twemoji.
 * The one in force is yellow with an ink border (`aria-selected`); the one the keyboard is on has a ring.
 */
function EmojiCell({ emoji, ...cell }: EmojiPickerListEmojiProps) {
  const chosen = useContext(ChosenEmoji) === emoji.emoji
  // The role of the cell is the picker's (gridcell): its aria-selected goes in with what the picker gives.
  const gridcell = { ...cell, 'aria-selected': chosen || cell['aria-selected'] }
  return (
    <button
      type="button"
      {...gridcell}
      className={classNames(
        'flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-m border-2',
        chosen ? 'border-ink-900 bg-butter-300' : 'border-transparent',
        emoji.isActive && 'outline-3 outline-offset-1 outline-ink-900',
      )}
    >
      <Emoji emoji={emoji.emoji} size="name" />
    </button>
  )
}

/** The title above a category, which stays at the top of the list while its emojis go by. */
function CategoryTitle({ category, ...title }: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      {...title}
      className="flex h-10 items-center bg-paper-50 px-1 font-title text-step leading-7 font-extrabold text-ink-900"
    >
      {category.label}
    </div>
  )
}

function Row(row: ComponentProps<'div'>) {
  return <div {...row} />
}

// 5, 6 or 7 columns of 56 px: the list is as wide as its columns, and centred in what it is given.
const WIDTHS: Readonly<Record<number, string>> = { 4: 'w-56', 5: 'w-70', 6: 'w-84', 7: 'w-98' }

export interface EmojiGridProps {
  columns: number
  /** The emoji in force, marked in the list. */
  chosen: string | undefined
}

/** The picker's one long list: a title for each category, then its emojis in rows. */
export function EmojiGrid({ columns, chosen }: EmojiGridProps) {
  return (
    <ChosenEmoji value={chosen}>
      <EmojiPicker.List
        className={classNames('mx-auto', WIDTHS[columns] ?? 'w-84')}
        components={{ Emoji: EmojiCell, CategoryHeader: CategoryTitle, Row }}
      />
    </ChosenEmoji>
  )
}
