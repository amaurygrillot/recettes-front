import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { Toast } from '../components/Toast/Toast'
import { strings } from './strings'
import { ToastsContext, type Notice, type Toasts } from './useToasts'

/** How long a notification of success stays: long enough to read, short enough not to be in the way. */
const SUCCESS_DURATION_MS = 4000

/**
 * The notifications of the app: a stack above the tabs on a phone, at the bottom right of a
 * desktop. A page asks for one with `useToasts`; it never has to place or remove it.
 */
export function ToastsProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<readonly Notice[]>([])
  const lastId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setNotices((current) => current.filter((notice) => notice.id !== id))
  }, [])

  const toasts = useMemo<Toasts>(() => {
    function add(notice: Omit<Notice, 'id'>): number {
      lastId.current += 1
      const id = lastId.current
      setNotices((current) => [...current, { ...notice, id }])
      return id
    }
    return {
      success: (message) => {
        const id = add({ tone: 'success', message })
        setTimeout(() => {
          dismiss(id)
        }, SUCCESS_DURATION_MS)
      },
      failure: (notice) => {
        add({ tone: 'error', ...notice })
      },
    }
  }, [dismiss])

  return (
    <ToastsContext value={toasts}>
      {children}
      <div
        aria-label={strings.notifications}
        role="region"
        className="pointer-events-none fixed inset-x-4 bottom-28 z-40 flex flex-col gap-2 desktop:inset-x-auto desktop:right-8 desktop:bottom-8 desktop:w-105"
      >
        {notices.map((notice) => (
          <div key={notice.id} className="pointer-events-auto">
            <Toast
              tone={notice.tone}
              message={notice.message}
              detail={notice.detail}
              action={
                notice.retry === undefined
                  ? undefined
                  : {
                      label: strings.retry,
                      onAction: () => {
                        dismiss(notice.id)
                        notice.retry?.()
                      },
                    }
              }
              onClose={() => {
                dismiss(notice.id)
              }}
            />
          </div>
        ))}
      </div>
    </ToastsContext>
  )
}
