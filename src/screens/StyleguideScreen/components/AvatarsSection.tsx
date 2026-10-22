import { Avatar } from '../../../components/Avatar/Avatar'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideSpecimen } from './StyleguideSpecimen'

const { avatars } = strings
const SIZES = [40, 56, 72, 96] as const

export function AvatarsSection() {
  const [sampleName] = avatars.names

  return (
    <StyleguideSection title={avatars.title}>
      <StyleguideSpecimen label={avatars.sizes}>
        <div className="flex flex-wrap items-end gap-6">
          {SIZES.map((size) => (
            <Avatar key={size} name={sampleName} size={size} />
          ))}
        </div>
      </StyleguideSpecimen>
      <StyleguideSpecimen label={avatars.palettes}>
        <div className="flex flex-wrap gap-4">
          {avatars.names.map((name) => (
            <Avatar key={name} name={name} />
          ))}
        </div>
      </StyleguideSpecimen>
      <div className="flex flex-wrap gap-8">
        <StyleguideSpecimen label={avatars.nameless}>
          <Avatar />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={avatars.singleName}>
          <Avatar name={avatars.singleNameValue} />
        </StyleguideSpecimen>
      </div>
    </StyleguideSection>
  )
}
