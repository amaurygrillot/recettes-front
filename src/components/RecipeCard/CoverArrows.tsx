import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'
import { strings } from './strings'

export interface CoverArrowsProps {
  onPrevious: () => void
  onNext: () => void
}

function Arrow({ icon, label, onClick }: { icon: IconName; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      // The keys ← and → on the card are the keyboard's way; these are for the pointer, so they stay out of the tab order.
      tabIndex={-1}
      onClick={onClick}
      className="pointer-events-auto grid size-11 cursor-pointer place-items-center rounded-full border-2 border-ink-900 bg-paper-50 text-ink-900 opacity-0 shadow-stamp-xs transition-opacity group-focus-within/card:opacity-100 group-hover/card:opacity-100 focus-visible:opacity-100 active:bg-butter-200"
    >
      <Icon name={icon} size={24} strokeWidth={2.8} />
    </button>
  )
}

/**
 * The two arrows of a desktop over the photos of a card, in the middle of the photo's height, so never over the
 * title. They show when the pointer is over the card or the card has the focus. They sit beside the card's link, not in
 * it: a button cannot be inside a link. A phone and a tablet slide the photos with a finger and have none.
 */
export function CoverArrows({ onPrevious, onNext }: CoverArrowsProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0.5 top-0.5 hidden aspect-4/3 items-center justify-between px-2 desktop:flex">
      <Arrow icon="chevron-left" label={strings.previousPhoto} onClick={onPrevious} />
      <Arrow icon="chevron-right" label={strings.nextPhoto} onClick={onNext} />
    </div>
  )
}
