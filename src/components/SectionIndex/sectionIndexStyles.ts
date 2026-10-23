import { classNames } from '../../lib/classNames'

export const SECTION_INDEX_ENTRY_BASE =
  'flex min-h-13 w-full items-center gap-3 rounded-pill border-2 pr-4 pl-3 text-left text-body whitespace-nowrap focus-visible:outline-offset-3'

/** The class of an entry that is not a section (a button after the rule), so that it looks like the others. */
export const SECTION_INDEX_ENTRY = classNames(
  SECTION_INDEX_ENTRY_BASE,
  'cursor-pointer border-transparent text-ink-800 hover:bg-paper-200',
)
