import type { RecipeList } from '../api/lists'

/** A list as the back end answers it; each test overrides what it is about. */
export function aList(overrides: Partial<RecipeList> = {}): RecipeList {
  return {
    id: 'l-1',
    name: 'Noël',
    emoji: '🎄',
    recipeCount: 0,
    createdAt: '2026-11-01T10:00:00.000000Z',
    updatedAt: '2026-11-01T10:00:00.000000Z',
    coverVersion: null,
    recipeCoverMediaIds: [],
    ...overrides,
  }
}
