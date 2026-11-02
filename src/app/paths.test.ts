import { describe, expect, it } from 'vitest'
import { categoryResultsPath, loginPath, paths, resultsPath, returnPathFrom } from './paths'
import { EMPTY_CRITERIA } from './searchCriteria'

describe('paths', () => {
  it('builds the URLs that take an id', () => {
    expect(paths.recipe('42')).toBe('/recettes/42')
    expect(paths.cooking('42')).toBe('/recettes/42/pas-a-pas')
    expect(paths.editRecipe('42')).toBe('/recettes/42/modifier')
  })

  it('keeps the password-reset path the back end writes in its e-mails', () => {
    expect(paths.resetPassword).toBe('/reset-password')
  })
})

describe('categoryResultsPath', () => {
  it('leads to the results of a category', () => {
    expect(categoryResultsPath('c-1')).toBe('/rechercher?categorie=c-1')
  })

  it('escapes an id that needs it', () => {
    expect(categoryResultsPath('a&b')).toBe('/rechercher?categorie=a%26b')
  })
})

describe('resultsPath', () => {
  it.each([
    ['a word', { query: 'tarte' }, false, '/rechercher?q=tarte'],
    [
      'every criterion, the order included',
      {
        query: 'tarte',
        categoryId: 'c-1',
        exactCategory: true,
        tagId: 't-1',
        author: 'Odile',
        sort: 'title-asc' as const,
      },
      false,
      '/rechercher?q=tarte&categorie=c-1&exacte=1&tag=t-1&auteur=Odile&tri=titre-az',
    ],
    ['a filter alone', { categoryId: 'c-1' }, false, '/rechercher?categorie=c-1'],
    ['a word in « Mes recettes »', { query: 'tarte' }, true, '/mes-recettes?q=tarte'],
    ['nothing in « Mes recettes »', {}, true, '/mes-recettes'],
  ])('leads to the results of %s', (_what, criteria, mine, expected) => {
    expect(resultsPath({ ...EMPTY_CRITERIA, ...criteria }, { mine })).toBe(expected)
  })
})

describe('loginPath', () => {
  it('is the login screen when there is nowhere to come back to', () => {
    expect(loginPath()).toBe('/connexion')
  })

  it('remembers the page to come back to, query and all', () => {
    expect(loginPath('/rechercher?title=gratin')).toBe(
      '/connexion?retour=%2Frechercher%3Ftitle%3Dgratin',
    )
  })
})

describe('returnPathFrom', () => {
  it.each([
    ['a page', '/mes-recettes', '/mes-recettes'],
    [
      'a page with a query and a fragment',
      '/rechercher?title=gratin#top',
      '/rechercher?title=gratin#top',
    ],
    ['the home page', '/', '/'],
    ['a path with a dot segment', '/a/../mes-recettes', '/mes-recettes'],
  ])('keeps %s', (_name, raw, expected) => {
    expect(returnPathFrom(new URLSearchParams({ retour: raw }))).toBe(expected)
  })

  it('round-trips what loginPath wrote', () => {
    const [, query = ''] = loginPath('/rechercher?title=a%20b&page=2').split('?')

    expect(returnPathFrom(new URLSearchParams(query))).toBe('/rechercher?title=a%20b&page=2')
  })

  it.each([
    ['nothing', undefined],
    ['an empty value', ''],
    ['a relative path', 'mes-recettes'],
    ['another site', 'https://evil.example/phish'],
    ['a protocol-relative URL', '//evil.example/phish'],
    ['a backslash that browsers read as a slash', '/\\evil.example'],
    ['dot segments that leave a protocol-relative URL', '/.//evil.example'],
    ['a tab hidden in the slashes', '/\t/evil.example'],
    ['a script', 'javascript:alert(1)'],
    ['the login screen itself, which would loop', '/connexion'],
    ['the login screen with its own query', '/connexion?retour=%2Fcompte'],
  ])('sends %s to the home page', (_name, raw) => {
    const search = new URLSearchParams(raw === undefined ? {} : { retour: raw })

    expect(returnPathFrom(search)).toBe('/')
  })
})
