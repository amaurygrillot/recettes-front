import { DropdownMenu } from 'radix-ui'
import type { LexicalEditor } from 'lexical'
import { Icon } from '../Icon/Icon'
import { strings } from './strings'
import { chooseSize, type TextSize } from './textSize'
import { SIZE_CHOICES, type TextBase } from './textSizes'

export interface SizeMenuProps {
  editor: LexicalEditor
  base: TextBase
  size: TextSize
}

const TRIGGER =
  'inline-flex h-11 shrink-0 cursor-pointer items-center gap-0.5 rounded-m border-2 border-ink-900 bg-paper-50 py-0 pr-2 pl-2.5 text-ink-900 hover:bg-butter-100 focus-visible:outline-offset-2 data-[state=open]:bg-butter-300'

/**
 * « Taille » at the head of the bar: a list of the sizes the field offers, each written in its own size, in a
 * menu that opens above the bar. Choosing one gives the selection (or what is typed next) that size, and the
 * focus goes back to the text, where the selection still is.
 */
export function SizeMenu({ editor, base, size }: SizeMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger aria-label={strings.size(strings.sizeNames[size])} className={TRIGGER}>
        <Icon name="text-size" size={24} strokeWidth={2.4} />
        <Icon name="chevron-down" size={20} strokeWidth={2.4} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          align="start"
          sideOffset={16}
          collisionPadding={12}
          onCloseAutoFocus={(event) => {
            // The text keeps the caret and the keyboard: the menu only borrowed the focus.
            event.preventDefault()
            editor.focus()
          }}
          className="z-60 w-58 rounded-l border-2 border-ink-900 bg-paper-50 p-1.5 text-ink-900 shadow-sheet"
        >
          <DropdownMenu.RadioGroup
            value={size}
            onValueChange={(value) => {
              const chosen = SIZE_CHOICES[base].find((choice) => choice.size === value)
              if (chosen !== undefined) chooseSize(editor, size, chosen.size)
            }}
          >
            {SIZE_CHOICES[base].map((choice) => (
              <DropdownMenu.RadioItem
                key={choice.size}
                value={choice.size}
                className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-m px-3 outline-none data-[highlighted]:bg-butter-100 data-[state=checked]:bg-butter-300 data-[state=checked]:font-bold"
              >
                <span className="flex items-baseline gap-2.5">
                  <span className={choice.sampleClass}>{strings.sizeNames[choice.size]}</span>
                  <span className="text-caption font-normal text-ink-800">{choice.metrics}</span>
                </span>
                <DropdownMenu.ItemIndicator>
                  <Icon name="check" size={22} strokeWidth={2.6} />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
