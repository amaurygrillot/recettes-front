import { Logo } from '../../../components/Logo/Logo'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideSpecimen } from './StyleguideSpecimen'

const MARK_SIZES = [96, 64, 48, 40] as const
const ICON_SIZES = [32, 16] as const

export function LogoSection() {
  return (
    <StyleguideSection title={strings.logo.title}>
      <div className="flex flex-wrap items-end gap-8">
        <StyleguideSpecimen label={strings.logo.large}>
          <Logo variant="large" size={160} />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={strings.logo.largeOnButter}>
          <div className="rounded-l border-2 border-ink-900 bg-butter-300 p-4">
            <Logo variant="large" tone="on-butter" size={160} />
          </div>
        </StyleguideSpecimen>
        <StyleguideSpecimen label={strings.logo.largeMono}>
          <Logo variant="large" tone="mono" size={160} />
        </StyleguideSpecimen>
      </div>
      <div className="flex flex-wrap items-end gap-8">
        <StyleguideSpecimen label={strings.logo.lockup}>
          <Logo variant="lockup" size={40} />
        </StyleguideSpecimen>
        <StyleguideSpecimen label={strings.logo.mark}>
          <div className="flex items-end gap-4">
            {MARK_SIZES.map((size) => (
              <Logo key={size} variant="mark" size={size} />
            ))}
          </div>
        </StyleguideSpecimen>
        <StyleguideSpecimen label={strings.logo.icon}>
          <div className="flex items-end gap-4">
            {ICON_SIZES.map((size) => (
              <Logo key={size} variant="mark" size={size} />
            ))}
          </div>
        </StyleguideSpecimen>
      </div>
    </StyleguideSection>
  )
}
