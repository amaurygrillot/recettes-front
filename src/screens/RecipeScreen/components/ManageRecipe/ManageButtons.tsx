import { paths } from '../../../../app/paths'
import { Button } from '../../../../components/Button/Button'
import { LinkButton } from '../../../../components/LinkButton/LinkButton'
import { strings } from '../../strings'

export interface ManageButtonsProps {
  recipeId: string
  onDelete: () => void
}

/** « Modifier » and « Supprimer » beside the title, for the author and an administrator on a desktop. */
export function ManageButtons({ recipeId, onDelete }: ManageButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <LinkButton to={paths.editRecipe(recipeId)} variant="secondary" size="medium" icon="edit">
        {strings.actions.edit}
      </LinkButton>
      <Button variant="danger-outline" size="medium" icon="trash" onClick={onDelete}>
        {strings.actions.delete}
      </Button>
    </div>
  )
}
