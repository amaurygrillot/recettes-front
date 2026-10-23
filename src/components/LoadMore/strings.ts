// French writes the singular for 0 and 1.
const recipes = (count: number) => `${count} ${count < 2 ? 'recette' : 'recettes'}`

export const strings = {
  action: 'Voir plus de recettes',
  waiting: 'Chargement…',
  retry: 'Réessayer',
  count: (shown: number, total: number) => `${shown} sur ${recipes(total)}`,
  incoming: (count: number) => `Chargement de ${count} recettes de plus…`,
  loaded: (count: number) => `${recipes(count)} de plus chargée${count < 2 ? '' : 's'}`,
  end: (total: number) => `Tu as tout vu : ${recipes(total)}.`,
} as const
