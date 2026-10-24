import type { ReactNode } from 'react'
import { IconButton } from '../../../../components/IconButton/IconButton'
import { strings } from '../../strings'
import { DraftStatus, type DraftState } from '../DraftStatus/DraftStatus'

export interface EditorHeaderProps {
  /** « Nouvelle recette » or « Modifier la recette ». */
  title: string
  /** The cross: closes the editor (asking first when something was changed and not saved). */
  onClose: () => void
  /** What became of the draft; a page that has no form to keep has none to say. */
  draft?: DraftState | undefined
  /** Under the top bar and fixed with it: what is missing, once « Enregistrer » found something. */
  banner?: ReactNode
}

/**
 * The top of the editor, fixed: the cross (it closes, it does not go back), the title and what
 * became of the draft. From a desktop it is one row, 96 px high, on the paper of the cards.
 */
export function EditorHeader({ title, onClose, draft, banner }: EditorHeaderProps) {
  return (
    <header className="sticky top-0 z-30">
      <div className="flex flex-col gap-1.5 border-b-2 border-paper-300 bg-paper-100 px-4 pt-3.5 pb-2.5 desktop:h-24 desktop:flex-row desktop:items-center desktop:gap-5 desktop:border-ink-900 desktop:bg-paper-50 desktop:px-16 desktop:py-0">
        <div className="flex items-center gap-3 desktop:gap-5">
          <IconButton label={strings.close} icon="close" variant="outlined" onClick={onClose} />
          <h1 className="min-w-0 flex-1 font-title text-editor-title desktop:text-auth-state-title">
            {title}
          </h1>
        </div>
        {draft !== undefined && (
          <div className="desktop:ml-auto">
            <DraftStatus state={draft} />
          </div>
        )}
      </div>
      {banner}
    </header>
  )
}
