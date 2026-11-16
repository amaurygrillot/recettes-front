import { QueryClient } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { memberKey } from '../lib/memberStorage'
import { fakeToken } from '../test/fakeToken'
import { aList } from '../test/fakeLists'
import { listCoverKeys, listKeys } from './listKeys'
import { bindPrivateData } from './privateData'
import { createSessionStore } from './sessionStore'

const memberA = fakeToken({ userId: '1', username: 'anne' })
const memberB = fakeToken({ userId: '2', username: 'basile' })

let client: QueryClient
let session: ReturnType<typeof createSessionStore>
let stop: () => void

function fillWithPrivateData() {
  client.setQueryData(listKeys.mine, [aList()])
  client.setQueryData(listKeys.containing('r-1'), [aList({ containsRecipe: true })])
  client.setQueryData(listKeys.content('l-1', { title: 'tarte' }), { pages: [], pageParams: [] })
  client.setQueryData(listCoverKeys.one('l-1', 'v1', 'thumbnail'), new Blob(['photo']))
  client.setQueryData(['recipes', 'search', {}], { pages: [], pageParams: [] })
}

/** What the private queries still hold: a reset query stays in the cache, empty. */
function privateQueries() {
  return client
    .getQueryCache()
    .findAll()
    .filter((query) => query.queryKey[0] === 'lists' || query.queryKey[0] === 'list-covers')
    .filter((query) => query.state.data !== undefined)
}

beforeEach(() => {
  client = new QueryClient()
  session = createSessionStore(window.sessionStorage)
  stop = bindPrivateData(client, session)
})

afterEach(() => {
  stop()
  window.localStorage.clear()
  window.sessionStorage.clear()
})

describe('bindPrivateData', () => {
  it('drops every private query when the session ends, and nothing public', () => {
    session.signIn(memberA)
    fillWithPrivateData()

    session.signOut()

    expect(privateQueries()).toHaveLength(0)
    expect(client.getQueryData(['recipes', 'search', {}])).toBeDefined()
  })

  it('drops every private query when the next member signs in, even if nobody signed out', () => {
    session.signIn(memberA)
    fillWithPrivateData()

    session.signIn(memberB)

    expect(privateQueries()).toHaveLength(0)
  })

  it('drops every private query when the same member signs in again after an expiry', () => {
    session.signIn(memberA)
    session.expire(session.getToken() ?? '')
    client.setQueryData(listKeys.mine, [aList()])

    session.signIn(memberA)

    expect(privateQueries()).toHaveLength(0)
  })

  it('keeps what the lists say, and drops only their photos, while the session is expired', () => {
    session.signIn(memberA)
    fillWithPrivateData()

    session.expire(session.getToken() ?? '')

    expect(client.getQueryData(listKeys.mine)).toBeDefined()
    expect(client.getQueryData(listKeys.content('l-1', { title: 'tarte' }))).toBeDefined()
    expect(client.getQueryData(listCoverKeys.one('l-1', 'v1', 'thumbnail'))).toBeUndefined()
  })

  it('leaves the lists of a member alone when they only change their username', () => {
    session.signIn(memberA)
    fillWithPrivateData()

    session.rename('anne-marie')

    expect(client.getQueryData(listKeys.mine)).toBeDefined()
  })

  it('forgets what another member left on the device when someone signs in, and keeps their own', () => {
    window.localStorage.setItem(memberKey('1', 'draft.new'), 'anne')
    window.localStorage.setItem(memberKey('2', 'draft.new'), 'basile')

    session.signIn(memberB)

    expect(window.localStorage.getItem(memberKey('1', 'draft.new'))).toBeNull()
    expect(window.localStorage.getItem(memberKey('2', 'draft.new'))).toBe('basile')
  })

  it('keeps the drafts of a member through their own sign-out, expiry and sign-in', () => {
    session.signIn(memberA)
    window.localStorage.setItem(memberKey('1', 'draft.new'), 'anne')

    session.expire(session.getToken() ?? '')
    session.signOut()
    session.signIn(memberA)

    expect(window.localStorage.getItem(memberKey('1', 'draft.new'))).toBe('anne')
  })

  it('stops reacting once it is unbound', () => {
    session.signIn(memberA)
    fillWithPrivateData()
    stop()

    session.signOut()

    expect(privateQueries().length).toBeGreaterThan(0)
  })
})
