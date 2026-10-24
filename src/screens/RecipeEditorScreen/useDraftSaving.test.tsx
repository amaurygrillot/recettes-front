import { act, renderHook } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { validValues } from './editorFixtures'
import { loadDraft, saveDraft } from './editorDraft'
import { emptyValues, type EditorValues } from './editorModel'
import { useDraftSaving } from './useDraftSaving'

const KEY = 'recettes.draft.test'

function setup(initial: EditorValues = emptyValues(), enabled = true) {
  return renderHook(
    ({ on }) => {
      const form = useForm<EditorValues>({ defaultValues: initial })
      const drafts = useDraftSaving({ form, storageKey: KEY, initial, enabled: on })
      return { form, drafts }
    },
    { initialProps: { on: enabled } },
  )
}

describe('useDraftSaving', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('promises nothing before the first change', () => {
    const { result } = setup()

    expect(result.current.drafts.state).toBe('idle')
    expect(loadDraft(KEY)).toBeUndefined()
  })

  it('says it is keeping the draft at the first change, and has kept it a moment after the typing stops', () => {
    const { result } = setup()

    act(() => {
      result.current.form.setValue('title', 'Tarte')
    })
    expect(result.current.drafts.state).toBe('saving')
    expect(loadDraft(KEY)).toBeUndefined()
    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(result.current.drafts.state).toBe('saved')
    expect(loadDraft(KEY)?.values.title).toBe('Tarte')
  })

  it('waits for the typing to pause: one write for a burst of changes', () => {
    const write = vi.spyOn(Storage.prototype, 'setItem')
    const { result } = setup()

    act(() => {
      for (const title of ['T', 'Ta', 'Tar', 'Tart', 'Tarte']) {
        result.current.form.setValue('title', title)
        vi.advanceTimersByTime(100)
      }
      vi.advanceTimersByTime(600)
    })

    expect(write).toHaveBeenCalledOnce()
    expect(loadDraft(KEY)?.values.title).toBe('Tarte')
  })

  it('has no draft once the form is back to what it started from', () => {
    const { result } = setup()
    act(() => {
      result.current.form.setValue('title', 'Tarte')
      vi.advanceTimersByTime(600)
    })
    expect(loadDraft(KEY)).toBeDefined()

    act(() => {
      result.current.form.setValue('title', '')
      vi.advanceTimersByTime(600)
    })

    expect(loadDraft(KEY)).toBeUndefined()
    expect(result.current.drafts.state).toBe('idle')
  })

  it('says it could not keep the draft when the device refuses, and the form goes on', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota', 'QuotaExceededError')
    })
    const { result } = setup()

    act(() => {
      result.current.form.setValue('title', 'Tarte')
      vi.advanceTimersByTime(600)
    })

    expect(result.current.drafts.state).toBe('failed')
    expect(result.current.form.getValues('title')).toBe('Tarte')
  })

  it('keeps the draft at once on demand', () => {
    const { result } = setup()
    act(() => {
      result.current.form.setValue('title', 'Tarte')
    })

    act(() => {
      result.current.drafts.keepNow()
    })

    expect(result.current.drafts.state).toBe('saved')
    expect(loadDraft(KEY)?.values.title).toBe('Tarte')
  })

  it('keeps what was still waiting when the editor goes away: the last words are not lost', () => {
    const { result, unmount } = setup()
    act(() => {
      result.current.form.setValue('title', 'Tarte au citron')
    })

    unmount()

    expect(loadDraft(KEY)?.values.title).toBe('Tarte au citron')
  })

  it('forgets the draft, and what was waiting, once the recipe is saved', () => {
    saveDraft(KEY, validValues())
    const { result, unmount } = setup()
    act(() => {
      result.current.form.setValue('title', 'Tarte au citron')
    })

    act(() => {
      result.current.drafts.discard()
    })
    unmount()

    expect(loadDraft(KEY)).toBeUndefined()
    expect(result.current.drafts.state).toBe('idle')
  })

  it('keeps nothing while it is off', () => {
    const { result } = setup(emptyValues(), false)

    act(() => {
      result.current.form.setValue('title', 'Tarte')
      vi.advanceTimersByTime(600)
    })

    expect(loadDraft(KEY)).toBeUndefined()
    expect(result.current.drafts.state).toBe('idle')
  })
})
