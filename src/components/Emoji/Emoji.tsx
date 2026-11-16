import { classNames } from '../../lib/classNames'
import { twemojiPath } from '../../lib/emoji/twemojiFileName'

export type EmojiSize = 'name' | 'badge' | 'title' | 'tile'

// The four sizes of the boards, each named for what it sits next to (tokens in styles/index.css). The
// emoji of a title grows with the title, and the one of a tile with the tile.
const SIZES: Record<EmojiSize, string> = {
  name: 'size-emoji-name',
  badge: 'size-emoji-badge',
  title: 'size-emoji-title tablet:size-emoji-title-tablet desktop:size-emoji-title-desktop',
  tile: 'size-emoji-tile tablet:size-emoji-tile-tablet desktop:size-emoji-tile-desktop',
}

export interface EmojiProps {
  /** The emoji itself (« 🎄 »): the drawing is Twemoji's, the same on every device. */
  emoji: string
  size: EmojiSize
}

/**
 * The drawing of an emoji. It is decorative on purpose: beside a name, or large on a tile, the name
 * of the list says everything, and a screen reader never reads « arbre de Noël » before it. Where an
 * emoji is the content (the picker), the control that holds it carries its name.
 */
export function Emoji({ emoji, size }: EmojiProps) {
  return (
    <img
      src={twemojiPath(emoji)}
      alt=""
      draggable={false}
      loading="lazy"
      decoding="async"
      className={classNames('inline-block shrink-0 select-none', SIZES[size])}
    />
  )
}
