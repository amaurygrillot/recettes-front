import { Mascot, type MascotMood, type MascotSize } from '../../../components/Mascot/Mascot'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideSpecimen } from './StyleguideSpecimen'

const MOODS: readonly MascotMood[] = [
  'happy',
  'dejected',
  'smitten',
  'surprised',
  'lost',
  'asleep',
  'celebrating',
]
const SIZES: readonly MascotSize[] = ['xl', 'large', 'medium', 'small']

export function MascotSection() {
  return (
    <StyleguideSection title={strings.mascot.title}>
      <div className="flex flex-wrap items-end gap-8">
        {MOODS.map((mood) => (
          <StyleguideSpecimen key={mood} label={strings.mascot.moods[mood]}>
            <Mascot mood={mood} size="medium" />
          </StyleguideSpecimen>
        ))}
      </div>
      <StyleguideSpecimen label={strings.mascot.sizes}>
        <div className="flex flex-wrap items-end gap-6">
          {SIZES.map((size) => (
            <Mascot key={size} mood="happy" size={size} />
          ))}
        </div>
      </StyleguideSpecimen>
    </StyleguideSection>
  )
}
