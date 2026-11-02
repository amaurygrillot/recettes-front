import { paths } from '../../../../app/paths'
import { AlertDialog } from '../../../../components/AlertDialog/AlertDialog'
import { Button } from '../../../../components/Button/Button'
import { LinkButton } from '../../../../components/LinkButton/LinkButton'
import { Mascot } from '../../../../components/Mascot/Mascot'
import { strings } from '../../strings'

export interface PublishedDialogProps {
  open: boolean
  /** « Voir la recette »: the recipe is already behind the dialog, so this only closes it. */
  onClose: () => void
}

/**
 * The little party after a recipe is created: the celebrating mascot, a sentence, and the two things one may want
 * next, to see the recipe (the first answer, which has the focus) or to write another.
 */
export function PublishedDialog({ open, onClose }: PublishedDialogProps) {
  return (
    <AlertDialog
      open={open}
      illustration={<Mascot mood="celebrating" size="medium" />}
      title={strings.published.title}
      description={strings.published.description}
    >
      <Button onClick={onClose}>{strings.published.see}</Button>
      <LinkButton to={paths.newRecipe} variant="secondary">
        {strings.published.another}
      </LinkButton>
    </AlertDialog>
  )
}
