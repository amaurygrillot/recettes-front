import { Icon } from '../../../components/Icon/Icon'
import { ICON_NAMES } from '../../../components/Icon/iconShapes'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'

export function IconsSection() {
  return (
    <StyleguideSection title={strings.icons.title}>
      <ul className="grid grid-cols-3 gap-3 tablet:grid-cols-6 desktop:grid-cols-8">
        {ICON_NAMES.map((name) => (
          <li
            key={name}
            className="flex flex-col items-center gap-2 rounded-l border-2 border-ink-900 bg-paper-50 px-1.5 pt-4 pb-3"
          >
            <Icon name={name} size={32} />
            <span className="text-caption text-ink-700">{name}</span>
          </li>
        ))}
      </ul>
    </StyleguideSection>
  )
}
