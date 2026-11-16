import { useState } from 'react'
import { Emoji } from '../../../components/Emoji/Emoji'
import { EmojiCredit } from '../../../components/EmojiCredit/EmojiCredit'
import { EmojiPicker } from '../../../components/EmojiPicker/EmojiPicker'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideSpecimen } from './StyleguideSpecimen'

const { emojis } = strings

/** The emoji of a list, in the four sizes of the boards, the picker that chooses one, and the credit. */
export function EmojisSection() {
  const [chosen, setChosen] = useState<string | undefined>(undefined)

  return (
    <StyleguideSection title={emojis.title}>
      <div className="grid gap-x-7 gap-y-8 tablet:grid-cols-2">
        <StyleguideSpecimen label={emojis.name}>
          <div className="flex items-center gap-3 text-label">
            <Emoji emoji="🎄" size="name" />
            {emojis.sampleName}
          </div>
        </StyleguideSpecimen>
        <StyleguideSpecimen label={emojis.badge}>
          <Emoji emoji="🍝" size="badge" />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={emojis.pageTitle}>
          <div className="flex items-center gap-3 font-title text-page-title tablet:text-page-title-lg">
            <Emoji emoji="👵" size="title" />
            {emojis.sampleTitle}
          </div>
        </StyleguideSpecimen>
        <StyleguideSpecimen label={emojis.tile}>
          <div className="flex w-fit rounded-xl bg-butter-100 p-4">
            <Emoji emoji="🥗" size="tile" />
          </div>
        </StyleguideSpecimen>
        <StyleguideSpecimen label={emojis.credit}>
          <EmojiCredit />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={emojis.picker}>
          <div className="flex flex-col gap-3">
            <div className="flex h-120 flex-col rounded-xl border-2 border-ink-900 bg-paper-50 p-4">
              <EmojiPicker selected={chosen} onSelect={setChosen} />
            </div>
            <p className="flex items-center gap-2 text-body">
              {chosen === undefined ? emojis.nothingChosen : emojis.chosen(chosen)}
              {chosen !== undefined && <Emoji emoji={chosen} size="name" />}
            </p>
          </div>
        </StyleguideSpecimen>
      </div>
    </StyleguideSection>
  )
}
