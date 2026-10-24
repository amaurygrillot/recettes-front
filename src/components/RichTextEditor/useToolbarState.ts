import { HistoryExtension } from '@lexical/history'
import { $isListNode, ListNode } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useExtensionSignalValue } from '@lexical/react/useExtensionSignalValue'
import { $getNearestNodeOfType } from '@lexical/utils'
import { $getSelection, $isRangeSelection } from 'lexical'
import { useEffect, useState } from 'react'

/** What the toolbar shows: which tools are on at the caret, and what can be undone or redone. */
export interface ToolbarState {
  bold: boolean
  italic: boolean
  bulletList: boolean
  numberList: boolean
  canUndo: boolean
  canRedo: boolean
}

type CaretState = Pick<ToolbarState, 'bold' | 'italic' | 'bulletList' | 'numberList'>

const NOWHERE: CaretState = { bold: false, italic: false, bulletList: false, numberList: false }

/** The tools that are on where the caret is (read inside an editor state). */
function $caretState(): CaretState {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) return NOWHERE
  const list = $getNearestNodeOfType(selection.anchor.getNode(), ListNode)
  const listType = $isListNode(list) ? list.getListType() : undefined
  return {
    bold: selection.hasFormat('bold'),
    italic: selection.hasFormat('italic'),
    bulletList: listType === 'bullet',
    numberList: listType === 'number',
  }
}

function sameCaret(a: CaretState, b: CaretState): boolean {
  return (
    a.bold === b.bold &&
    a.italic === b.italic &&
    a.bulletList === b.bulletList &&
    a.numberList === b.numberList
  )
}

/**
 * Follows the editor so that the toolbar's buttons say what is on at the caret, and what can be
 * undone or redone (the history says it itself). Use it inside the editor's composer.
 */
export function useToolbarState(): ToolbarState {
  const [editor] = useLexicalComposerContext()
  const canUndo = useExtensionSignalValue(HistoryExtension, 'canUndo')
  const canRedo = useExtensionSignalValue(HistoryExtension, 'canRedo')
  const [caret, setCaret] = useState<CaretState>(NOWHERE)

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const next = editorState.read($caretState)
      setCaret((current) => (sameCaret(current, next) ? current : next))
    })
  }, [editor])

  return { ...caret, canUndo, canRedo }
}
