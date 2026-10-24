import { useId } from 'react'
import { classNames } from '../../lib/classNames'
import { Button } from '../Button/Button'
import { Icon } from '../Icon/Icon'
import { RemovableChip } from '../RemovableChip/RemovableChip'

export interface ChoiceFieldItem {
  id: string
  label: string
}

export interface ChoiceFieldProps {
  /** Always visible, above the field: « Catégories ». */
  label: string
  /** Said next to the label (« facultatif »). */
  note?: string | undefined
  /** What has been chosen, each as a chip that goes away with one touch. */
  items: readonly ChoiceFieldItem[]
  /** The button while nothing is chosen: « Choisir des catégories ». */
  chooseLabel: string
  /** The button once something is chosen: « Ajouter une catégorie ». */
  addLabel: string
  /** The name of a chip's button: « Retirer la catégorie Desserts › Tartes ». It has to contain the label. */
  removeLabel: (itemLabel: string) => string
  onRemove: (id: string) => void
  /** Opens the sheet where the choice is made. */
  onOpen: () => void
  hint?: string | undefined
  error?: string | undefined
}

/**
 * A field that looks like a text field but is chosen from, not typed in: a frame holding what is
 * chosen as chips and the button that opens the list. Nothing can be created from it, so there is
 * no spelling to correct.
 */
export function ChoiceField({
  label,
  note,
  items,
  chooseLabel,
  addLabel,
  removeLabel,
  onRemove,
  onOpen,
  hint,
  error,
}: ChoiceFieldProps) {
  const labelId = useId()
  const messageId = useId()
  const message = error ?? hint

  return (
    <div className="flex flex-col gap-1.5">
      <div id={labelId} className="text-body font-bold">
        {label}
        {note && (
          <>
            {' '}
            <span className="ml-1 text-detail font-normal text-ink-700">{note}</span>
          </>
        )}
      </div>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={message ? messageId : undefined}
        className={classNames(
          'flex flex-wrap items-start gap-3 rounded-m p-3',
          error ? 'border-3 border-brick bg-brick-wash' : 'border-2 border-ink-500 bg-paper-50',
        )}
      >
        {items.map((item) => (
          <RemovableChip
            key={item.id}
            label={item.label}
            removeLabel={removeLabel(item.label)}
            onRemove={() => {
              onRemove(item.id)
            }}
          />
        ))}
        <Button variant="secondary" size="medium" icon="plus" onClick={onOpen}>
          {items.length === 0 ? chooseLabel : addLabel}
        </Button>
      </div>
      {message && (
        <p
          id={messageId}
          className={classNames(
            'flex items-start gap-2 text-detail',
            error ? 'font-bold text-brick' : 'text-ink-700',
          )}
        >
          {error && <Icon name="alert" size={22} strokeWidth={2.4} />}
          {message}
        </p>
      )}
    </div>
  )
}
