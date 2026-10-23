import { useState } from 'react'
import { TextField } from '../../../../components/TextField/TextField'
import { useDebouncedCallback } from '../../../../lib/useDebouncedCallback'
import { strings } from '../../strings'

const { author } = strings.filters

export interface AuthorFieldProps {
  value: string
  onChange: (author: string) => void
  /** How long to wait after the last letter before telling `onChange`; 0 tells it at once. */
  debounceMs: number
}

/** The author's name, or a part of it. What is typed shows at once; the search follows the pause. */
export function AuthorField({ value, onChange, debounceMs }: AuthorFieldProps) {
  // What has been typed and not passed on yet; the value of the page once it has.
  const [typed, setTyped] = useState<string | undefined>()
  const pause = useDebouncedCallback((text: string) => {
    onChange(text)
    setTyped(undefined)
  }, debounceMs)

  return (
    <TextField
      label={author.label}
      placeholder={author.placeholder}
      hint={author.hint}
      autoComplete="off"
      value={typed ?? value}
      onChange={(event) => {
        setTyped(event.target.value)
        pause.schedule(event.target.value)
      }}
    />
  )
}
