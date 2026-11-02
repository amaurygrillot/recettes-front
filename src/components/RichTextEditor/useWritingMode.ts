import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { logger } from '../../lib/logger'

const STATE_KEY = 'writingMode'

function hasWritingFlag(state: unknown): boolean {
  return (
    typeof state === 'object' && state !== null && STATE_KEY in state && state[STATE_KEY] === true
  )
}

/** The state of the current history entry, plus the flag: the entry the writing mode adds on a phone. */
function withWritingFlag(state: unknown): object {
  return typeof state === 'object' && state !== null
    ? { ...state, [STATE_KEY]: true }
    : { [STATE_KEY]: true }
}

interface WritingModeState {
  writing: boolean
  open: () => void
  close: () => void
}

/**
 * Whether a field is in writing mode. On a phone, opening adds one history entry for the same address, so that the
 * device's back gesture (which removes it) closes the mode instead of leaving the page, and closing any other
 * way removes it again. The leave guard of the editor only counts a change of path or search, so it stands aside.
 * `onClosedOnPhone` hears of every close of a mode that was opened on a phone (the page is then shown again, scrolled).
 */
export function useWritingMode({
  phone,
  onClosedOnPhone,
}: {
  phone: boolean
  onClosedOnPhone: () => void
}): WritingModeState {
  const location = useLocation()
  const navigate = useNavigate()
  const [writing, setWriting] = useState(false)
  // `waiting`: the entry was asked for and has not arrived yet; `there`: it is the current one.
  const entry = useRef<'none' | 'waiting' | 'there'>('none')
  const openedOnPhone = useRef(false)

  function finish(): void {
    setWriting(false)
    if (openedOnPhone.current) onClosedOnPhone()
    openedOnPhone.current = false
  }

  function open(): void {
    logger.debug('Writing mode opened', { phone })
    openedOnPhone.current = phone
    setWriting(true)
    if (!phone) return
    entry.current = 'waiting'
    void navigate(`${location.pathname}${location.search}`, {
      state: withWritingFlag(location.state),
      preventScrollReset: true,
      // The page goes to its own address: nothing it loaded can have changed.
      defaultShouldRevalidate: false,
    })
  }

  function close(): void {
    logger.debug('Writing mode closed')
    finish()
    if (entry.current !== 'none') {
      entry.current = 'none'
      void navigate(-1)
    }
  }

  // The device's back gesture: the entry the mode added is gone, which is the same as « Terminé ».
  const followHistory = useEffectEvent((state: unknown) => {
    const flagged = hasWritingFlag(state)
    if (entry.current === 'waiting' && flagged) {
      entry.current = 'there'
    } else if (entry.current === 'there' && !flagged) {
      entry.current = 'none'
      logger.debug('Writing mode closed by the back gesture')
      finish()
    }
  })
  useEffect(() => {
    followHistory(location.state)
  }, [location.state])

  return { writing, open, close }
}
