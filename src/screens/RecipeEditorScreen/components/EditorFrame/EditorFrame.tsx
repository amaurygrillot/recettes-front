import type { ReactNode } from 'react'
import { EditorHeader, type EditorHeaderProps } from '../EditorHeader/EditorHeader'

export interface EditorFrameProps extends EditorHeaderProps {
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
export function EditorFrame({ index, children, actions, ...header }: EditorFrameProps) {
  return (
    <main className="flex min-h-dvh flex-col bg-paper-100">
      <EditorHeader {...header} />
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
