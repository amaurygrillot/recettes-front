import { Button } from '../Button/Button'

export interface SubmitButtonProps {
  /** The request is on its way: the button says so and cannot be pressed again. */
  pending: boolean
  /** What it does: « Créer mon compte ». */
  label: string
  /** What it says while it works: « Création du compte… ». */
  pendingLabel: string
}

/**
 * The full-width button that sends a form. While the request runs it keeps its place and its
 * focus (it is busy, not disabled) and changes its words, so a form cannot be sent twice.
 */
export function SubmitButton({ pending, label, pendingLabel }: SubmitButtonProps) {
  return (
    <Button type="submit" fullWidth busy={pending}>
      {pending ? pendingLabel : label}
    </Button>
  )
}
