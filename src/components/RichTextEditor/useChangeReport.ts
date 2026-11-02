import type { LexicalEditor } from 'lexical'
import { useEffect, useEffectEvent } from 'react'
import { $toHtml } from './htmlConversion'

/**
 * Tells `onChange` the HTML to store each time the text changes, and only then: what the editor started with is
 * not a change. The listener is registered once per editor, whatever `onChange` does between two renders.
 */
export function useChangeReport(editor: LexicalEditor, onChange: (html: string) => void): void {
  const report = useEffectEvent(onChange)

  useEffect(() => {
    // `read` first commits the initial text: only what the person changes from here on is reported.
    let lastHtml = editor.read($toHtml)
    return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return
      const html = editorState.read($toHtml)
      if (html === lastHtml) return
      lastHtml = html
      report(html)
    })
  }, [editor])
}
