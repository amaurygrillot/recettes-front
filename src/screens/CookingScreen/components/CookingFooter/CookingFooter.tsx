import type { ReactNode } from 'react'
import { Button } from '../../../../components/Button/Button'
import { Icon } from '../../../../components/Icon/Icon'
import { strings } from '../../strings'

export interface CookingFooterProps {
  /** The step being cooked, counted from 1. */
  step: number
  total: number
  onPrevious: () => void
  /** « Suivant », or « Terminer » on the last step. */
  onNext: () => void
  /** What is above the buttons: the way to the ingredients, on a phone. */
  above?: ReactNode
  /** Under the buttons, from a tablet: what the keys do. */
  keyHints?: ReactNode
}

/**
 * The foot of the screen, where the thumb is: « Précédent » and « Suivant », 64 px high, the second twice
 * as wide as the first (the right gesture is the easiest, even with a knuckle). The first step has no way
 * back (the button is there, dashed), the last one ends with « Terminer ». A recipe of a single step has only « Terminer ».
 */
export function CookingFooter({
  step,
  total,
  onPrevious,
  onNext,
  above,
  keyHints,
}: CookingFooterProps) {
  const last = step === total

  return (
    <div className="flex-none">
      {above !== undefined && <div className="px-4 pt-2.5 pb-3">{above}</div>}
      <div className="border-t-2 border-ink-900 bg-paper-50 px-4 pt-3 pb-5.5 tablet:py-3.5">
        <div className="mx-auto flex max-w-140 gap-3 desktop:max-w-170">
          {total > 1 && (
            <div className="flex-1">
              <Button
                variant="secondary"
                icon="chevron-left"
                fullWidth
                disabled={step === 1}
                onClick={onPrevious}
              >
                {strings.previous}
              </Button>
            </div>
          )}
          <div className={total > 1 ? 'flex-[2.2]' : 'flex-1'}>
            <Button fullWidth icon={last ? 'check' : undefined} onClick={onNext}>
              {last ? strings.finish : strings.next}
              {!last && <Icon name="chevron-right" />}
            </Button>
          </div>
        </div>
        {keyHints}
      </div>
    </div>
  )
}
