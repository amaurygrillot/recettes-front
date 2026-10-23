import { Link } from 'react-router'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'

export interface CreateLinkProps {
  /** Where the creation page is. */
  to: string
  /** The accessible name, and the visible text when expanded: « Nouvelle recette ». */
  label: string
  /** `true`: « + » and the label. `false`: the round 64 px « + » alone, which keeps `label` as its name. */
  expanded: boolean
}

const FORMS = {
  expanded: 'gap-2.5 pr-6 pl-4.5 text-label whitespace-nowrap',
  round: 'size-16',
}

/**
 * The link that starts a new recipe, drawn as the yellow « + » of the design: extended with its
 * label where there is room or the reader is at the top of the list, round when it must give way.
 * It is a link to the creation page, never a button that opens a menu. 64 px tall either way: it
 * is the primary action of the page and sits under a thumb.
 */
export function CreateLink({ to, label, expanded }: CreateLinkProps) {
  return (
    <Link
      to={to}
      aria-label={expanded ? undefined : label}
      className={classNames(
        'inline-flex h-16 items-center justify-center rounded-pill border-2 border-ink-900 bg-butter-300 font-bold text-ink-900 shadow-stamp hover:bg-butter-400 focus-visible:outline-offset-4 active:translate-1 active:bg-mustard-500 active:shadow-none',
        expanded ? FORMS.expanded : FORMS.round,
      )}
    >
      <Icon name="plus" size={expanded ? 28 : 30} strokeWidth={3} />
      {expanded && label}
    </Link>
  )
}
