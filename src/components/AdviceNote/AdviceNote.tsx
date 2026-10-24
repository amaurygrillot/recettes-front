import { RichTextView } from '../RichTextView/RichTextView'

export interface AdviceNoteProps {
  /** The cook's tip, as stored. */
  html: string
  /** What the page calls it, handwritten above the text: « le conseil de la cuisinière », « le petit conseil ». */
  title: string
  /** The accessible name of the frame (the title with its capital letter). */
  label: string
}

/** The cook's tip: a stitched frame with a handwritten title, only ever shown when there is a tip. */
export function AdviceNote({ html, title, label }: AdviceNoteProps) {
  return (
    <aside
      aria-label={label}
      className="flex flex-col gap-1.5 rounded-frame border-2 border-dashed border-ink-500 bg-paper-50 px-4.5 py-4"
    >
      <p aria-hidden="true" className="font-hand text-annotation text-mustard-700">
        {title}
      </p>
      <RichTextView html={html} />
    </aside>
  )
}
