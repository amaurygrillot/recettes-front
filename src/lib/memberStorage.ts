/**
 * What a member leaves on this device (an unsaved form, a note to come back to a sheet) belongs to
 * that member: the member's id is part of every key, so on a shared device another member never reads
 * it, and it is forgotten when another member signs in. Storage can be blocked or full: nothing
 * here throws.
 */
const MEMBER_PREFIX = 'recettes.member.'

/** The key under which `what` is kept for the member `userId`. */
export function memberKey(userId: string, what: string): string {
  return `${MEMBER_PREFIX}${userId}.${what}`
}

function forgetOthersIn(storage: Storage, userId: string): number {
  const own = `${MEMBER_PREFIX}${userId}.`
  const foreign = Array.from({ length: storage.length }, (_unused, index) => storage.key(index))
    .filter((key): key is string => key !== null)
    .filter((key) => key.startsWith(MEMBER_PREFIX) && !key.startsWith(own))
  foreign.forEach((key) => {
    storage.removeItem(key)
  })
  return foreign.length
}

/** Drops everything the other members left, in the tab and on the device. Answers how many keys went. */
export function forgetOtherMembers(userId: string): number {
  let forgotten = 0
  for (const open of [() => window.localStorage, () => window.sessionStorage]) {
    try {
      forgotten += forgetOthersIn(open(), userId)
    } catch {
      // Blocked storage keeps nothing, so there is nothing to forget.
    }
  }
  return forgotten
}
