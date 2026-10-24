import { useFormContext, useWatch } from 'react-hook-form'
import { TextField } from '../../../../components/TextField/TextField'
import type { EditorValues, PhotoListName } from '../../editorModel'
import { LIMITS } from '../../editorSchema'
import { messageOf } from '../../fieldError'
import { strings } from '../../strings'

export interface PhotoAltTextProps {
  name: PhotoListName
  index: number
}

/** What a photo shows, for those who cannot see it: optional, and kept to what the back end accepts. */
export function PhotoAltText({ name, index }: PhotoAltTextProps) {
  const { control, register, getFieldState, formState } = useFormContext<EditorValues>()
  const path = `${name}.${index}.altText` as const
  const typed = useWatch({ control, name: path }).length

  return (
    <TextField
      label={strings.photos.altText}
      note={strings.optional}
      compact
      placeholder={strings.photos.altTextPlaceholder}
      counter={{ typed, max: LIMITS.altText }}
      error={messageOf(getFieldState(path, formState).error)}
      {...register(path)}
    />
  )
}
