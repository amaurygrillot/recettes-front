import { RichTextView } from '../../../../components/RichTextView/RichTextView'
import { strings } from '../../strings'

export interface AdviceNoteProps {
  /** The cook's tip, as stored. */
  html: string
}

/** « Le conseil de la cuisinière »: a stitched frame after the last step, only when there is a tip. */
export function AdviceNote({ html }: AdviceNoteProps) {
  return (
    <aside
      aria-label={strings.advice.label}
      className="mt-5.5 flex flex-col gap-1.5 rounded-frame border-2 border-dashed border-ink-500 bg-paper-50 px-4.5 py-4"
    >
      <p aria-hidden="true" className="font-hand text-annotation text-mustard-700">
        {strings.advice.title}
      </p>
      <RichTextView html={html} />
    </aside>
  )
}
