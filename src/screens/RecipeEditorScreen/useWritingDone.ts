import { useToasts } from '../../app/useToasts'

/**
 * What the page says when a text field's writing mode is closed on a phone: the field is updated, in the field's
 * own words (« Introduction mise à jour »). Give the result to the field as `onWritingDone`.
 */
export function useWritingDone(message: string): () => void {
  const toasts = useToasts()
  return () => {
    toasts.success(message)
  }
}
