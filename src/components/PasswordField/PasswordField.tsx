import { useState } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import { TextField, type TextFieldProps } from '../TextField/TextField'
import { strings } from './strings'

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing'>

/**
 * A text field for a password, with the 48 px eye inside it: it shows the characters (and turns
 * yellow, the eye crossed out) or hides them again. The name of the button says what it will do.
 */
export function PasswordField(props: PasswordFieldProps) {
  const [shown, setShown] = useState(false)

  return (
    <TextField
      {...props}
      type={shown ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          aria-label={shown ? strings.hide : strings.show}
          aria-pressed={shown}
          onClick={() => {
            setShown((current) => !current)
          }}
          className={classNames(
            'grid size-12 cursor-pointer place-items-center rounded-m border-2 text-ink-900 focus-visible:outline-offset-2',
            shown
              ? 'border-ink-900 bg-butter-300'
              : 'border-transparent enabled:hover:bg-paper-200 enabled:active:bg-paper-300',
          )}
        >
          <Icon name={shown ? 'eye-off' : 'eye'} size={26} strokeWidth={2.4} />
        </button>
      }
    />
  )
}
