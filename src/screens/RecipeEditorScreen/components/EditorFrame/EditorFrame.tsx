import type { ReactNode } from 'react'
import { IconButton } from '../../../../components/IconButton/IconButton'
import { strings } from '../../strings'
import { DraftStatus, type DraftState } from '../DraftStatus/DraftStatus'

export interface EditorFrameProps {
  /** « Nouvelle recette » or « Modifier la recette ». */
  title: string
  /** The cross: closes the editor (asking first when something was changed and not saved). */
  onClose: () => void
  draft: DraftState
  /** Under the top bar and fixed with it: what is missing, once « Enregistrer » found something. */
  banner?: ReactNode
  /** The index of the sections, from a desktop. */
  index?: ReactNode
  /** The sections, and what comes before them. */
  children: ReactNode
  /** The two buttons of the bar fixed at the bottom. */
  actions: ReactNode
}

/**
 * The page of the editor: a task of its own, without tabs. The top (the cross, the title, what became
 * of the draft) and the bottom (cancel and save) stay where they are, and only the middle scrolls. From a
 * desktop the sections have their index on the left and the bar sits at the foot of the column.
 */
export function EditorFrame({
  title,
  onClose,
  draft,
  banner,
  index,
  children,
  actions,
}: EditorFrameProps) {
  return (
    <main className="flex min-h-dvh flex-col bg-paper-100">
      <header className="sticky top-0 z-30">
        <div className="flex flex-col gap-1.5 border-b-2 border-paper-300 bg-paper-100 px-4 pt-3.5 pb-2.5 desktop:h-24 desktop:flex-row desktop:items-center desktop:gap-5 desktop:border-ink-900 desktop:bg-paper-50 desktop:px-16 desktop:py-0">
          <div className="flex items-center gap-3 desktop:gap-5">
            <IconButton label={strings.close} icon="close" variant="outlined" onClick={onClose} />
            <h1 className="min-w-0 flex-1 font-title text-editor-title desktop:text-auth-state-title">
              {title}
            </h1>
          </div>
          <div className="desktop:ml-auto">
            <DraftStatus state={draft} />
          </div>
        </div>
        {banner}
      </header>
      <div className="mx-auto flex w-full max-w-267 flex-1 gap-12 px-4 pt-4.5 tablet:px-8 desktop:px-0 desktop:pt-7">
        {index && (
          <div className="hidden w-55 shrink-0 desktop:block">
            <div className="sticky top-32">{index}</div>
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col desktop:max-w-200">
          <div className="flex flex-col gap-6.5 pb-8 desktop:gap-7.5">{children}</div>
          <div className="sticky bottom-0 z-20 -mx-4 mt-auto flex gap-3 border-t-2 border-ink-900 bg-paper-50 px-4 pt-3 pb-5.5 shadow-bar tablet:-mx-8 desktop:mx-0 desktop:rounded-t-xl desktop:border-x-2 desktop:px-5">
            {actions}
          </div>
        </div>
      </div>
    </main>
  )
}
