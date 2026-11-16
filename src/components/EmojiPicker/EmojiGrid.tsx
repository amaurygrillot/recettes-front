import {
  EmojiPicker,
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
} from 'frimousse'
import type { ComponentProps } from 'react'
import { classNames } from '../../lib/classNames'
import { Emoji } from '../Emoji/Emoji'

/** One emoji: a 56 px cell, named in French (the picker gives it its `aria-label`), drawn by Twemoji. */
function EmojiCell({ emoji, ...cell }: EmojiPickerListEmojiProps) {
  return (
    <button
      type="button"
      {...cell}
      className={classNames(
        'flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-m border-2',
        emoji.isActive ? 'border-ink-900 bg-butter-200' : 'border-transparent',
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
      className="flex h-10 items-center bg-paper-50 px-1 font-title text-detail font-bold text-ink-900"
    >
      {category.label}
    </div>
  )
}

function Row(row: ComponentProps<'div'>) {
  return <div {...row} />
}

// 5, 6 or 7 columns of 56 px: the list is as wide as its columns, and centred in what it is given.
const WIDTHS: Readonly<Record<number, string>> = { 5: 'w-70', 6: 'w-84', 7: 'w-98' }

export interface EmojiGridProps {
  columns: number
}

/** The picker's one long list: a title for each category, then its emojis in rows. */
export function EmojiGrid({ columns }: EmojiGridProps) {
  return (
    <EmojiPicker.List
      className={classNames('mx-auto', WIDTHS[columns] ?? 'w-84')}
      components={{ Emoji: EmojiCell, CategoryHeader: CategoryTitle, Row }}
    />
  )
}
