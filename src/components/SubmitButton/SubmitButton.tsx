import { Button } from '../Button/Button'

export interface SubmitButtonProps {
  /** The request is on its way: the button says so and cannot be pressed again. */
  pending: boolean
  /** What it does: « Créer mon compte ». */
  label: string
  /** What it says while it works: « Création du compte… ». */
  pendingLabel: string
  /** Nothing to send yet (nothing was changed): dashed, and it cannot be pressed. */
  disabled?: boolean
  /** The width of its container (a phone), or just its words (a desktop's cards). */
  fullWidth?: boolean
}

/**
 * The button that sends a form. While the request runs it keeps its place and its focus (it is
 * busy, not disabled) and changes its words, so a form cannot be sent twice.
 */
export function SubmitButton({
  pending,
  label,
  pendingLabel,
  disabled = false,
  fullWidth = true,
}: SubmitButtonProps) {
  return (
    <Button type="submit" fullWidth={fullWidth} busy={pending} disabled={disabled && !pending}>
      {pending ? pendingLabel : label}
    </Button>
  )
}
