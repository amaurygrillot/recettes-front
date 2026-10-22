import { useState } from 'react'
import { FilterChip } from '../../../components/FilterChip/FilterChip'
import { Tag } from '../../../components/Tag/Tag'
import { strings } from '../strings'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideSpecimen } from './StyleguideSpecimen'

const { tags } = strings
const FILTERS = [tags.desserts, tags.soups, tags.mains]

export function TagsSection() {
  const [chosen, setChosen] = useState<readonly string[]>([tags.soups])

  function toggle(filter: string) {
    setChosen((current) =>
      current.includes(filter) ? current.filter((name) => name !== filter) : [...current, filter],
    )
  }

  return (
    <StyleguideSection title={tags.title}>
      <StyleguideSpecimen label={tags.tags}>
        <div className="flex flex-wrap gap-2.5">
          <Tag>{tags.plate}</Tag>
          <Tag tone="herb" icon="leaf">
            {tags.vegetarian}
          </Tag>
          <Tag tone="brick">{tags.nuts}</Tag>
          <Tag tone="paper" icon="cake">
            {tags.dessert}
          </Tag>
        </div>
      </StyleguideSpecimen>
      <StyleguideSpecimen label={tags.filters}>
        <div className="flex flex-wrap gap-3">
          {FILTERS.map((filter) => (
            <FilterChip
              key={filter}
              selected={chosen.includes(filter)}
              onClick={() => {
                toggle(filter)
              }}
            >
              {filter}
            </FilterChip>
          ))}
          <FilterChip selected={false} disabled>
            {tags.disabled}
          </FilterChip>
        </div>
      </StyleguideSpecimen>
    </StyleguideSection>
  )
}
