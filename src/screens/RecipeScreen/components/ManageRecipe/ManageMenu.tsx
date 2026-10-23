import { DropdownMenu } from 'radix-ui'
import { Link } from 'react-router'
import { paths } from '../../../../app/paths'
import { IconButton } from '../../../../components/IconButton/IconButton'
import { strings } from '../../strings'

export interface ManageMenuProps {
  recipeId: string
  onDelete: () => void
}

const ITEM =
  'flex min-h-14 cursor-pointer items-center px-4 text-body font-bold outline-none data-[highlighted]:bg-butter-100'

/**
 * « ⋯ » over the photo, for the author and an administrator on a phone and a tablet: a menu with
 * « Modifier » (a link to the editor) and « Supprimer » (which only asks: the dialog confirms).
 */
export function ManageMenu({ recipeId, onDelete }: ManageMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton label={strings.actions.menu} icon="more" variant="round" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          aria-label={strings.actions.menu}
          className="z-40 min-w-48 overflow-hidden rounded-m border-2 border-ink-900 bg-paper-50 text-ink-900 shadow-sheet"
        >
          <DropdownMenu.Item asChild>
            <Link to={paths.editRecipe(recipeId)} className={ITEM}>
              {strings.actions.edit}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={onDelete}
            className={`${ITEM} border-t-2 border-dotted border-ink-500 text-brick`}
          >
            {strings.actions.delete}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
