import { createContext, use, useState } from 'react'

/** Lets the pictures on their way be counted, so that the recipe is not saved without them. */
export interface UploadTracker {
  /** A picture starts its way; the function it returns says it arrived, failed or was given up. */
  begin: () => () => void
}

const NO_TRACKER: UploadTracker = {
  begin: () => () => undefined,
}

export const UploadTrackerContext = createContext<UploadTracker>(NO_TRACKER)

/** The tracker the sections of the editor report to. */
export function useUploadTracker(): UploadTracker {
  return use(UploadTrackerContext)
}

/** How many pictures are on their way, and the tracker that counts them. */
export function useUploadsOnTheirWay(): { count: number; tracker: UploadTracker } {
  const [count, setCount] = useState(0)
  const [tracker] = useState<UploadTracker>(() => ({
    begin: () => {
      setCount((current) => current + 1)
      let released = false
      return () => {
        if (released) return
        released = true
        setCount((current) => current - 1)
      }
    },
  }))
  return { count, tracker }
}
