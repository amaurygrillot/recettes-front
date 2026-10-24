import type { ReactNode } from 'react'
import { EditorHeader } from '../EditorHeader/EditorHeader'

export interface EditorMessageProps {
  title: string
  onClose: () => void
  /** The whole message of the page: a wait, a refusal, a failure. */
  children: ReactNode
}

/** The editor when there is no form to show: its top bar, and a message on the whole page. */
export function EditorMessage({ title, onClose, children }: EditorMessageProps) {
  return (
    <main className="flex min-h-dvh flex-col bg-paper-100">
      <EditorHeader title={title} onClose={onClose} />
      <div className="mx-auto flex w-full max-w-140 flex-1 flex-col gap-4 px-4 py-6 desktop:py-10">
        {children}
      </div>
    </main>
  )
}
