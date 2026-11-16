import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmojiCredit } from './EmojiCredit'

describe('EmojiCredit', () => {
  it('credits Twemoji and its licence in one sentence', () => {
    render(<EmojiCredit />)

    expect(screen.getByText(/Dessins des émojis/)).toHaveTextContent(
      'Dessins des émojis : Twemoji, licence CC-BY 4.0.',
    )
  })
})
