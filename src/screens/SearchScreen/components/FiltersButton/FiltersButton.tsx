import { Button } from '../../../../components/Button/Button'
import { CountBadge } from '../../../../components/CountBadge/CountBadge'
import { Icon } from '../../../../components/Icon/Icon'
import { IconButton } from '../../../../components/IconButton/IconButton'
import { strings } from '../../strings'

const { filters } = strings

export interface FiltersButtonProps {
  /** How many filters are in force: the button is yellow and counts them when there are some. */
  count: number
  /** From 600 px the button carries its word, as designed. */
  labelled: boolean
  /** Opens the search on its filters. */
  onOpen: () => void
}

/** « Filtres » on the results page of a phone and a tablet: it opens the search over the page, on the filters. */
export function FiltersButton({ count, labelled, onOpen }: FiltersButtonProps) {
  const label = count > 0 ? filters.buttonActive(count) : filters.button

  return labelled ? (
    <Button
      variant={count > 0 ? 'primary' : 'secondary'}
      size="medium"
      aria-label={label}
      aria-haspopup="dialog"
      onClick={onOpen}
    >
      <Icon name="filter" />
      {filters.button}
      {count > 0 && <CountBadge count={count} />}
    </Button>
  ) : (
    <IconButton
      label={label}
      icon="filter"
      variant={count > 0 ? 'active' : 'outlined'}
      badge={count}
      aria-haspopup="dialog"
      onClick={onOpen}
    />
  )
}
