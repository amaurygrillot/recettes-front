// French writes the singular for 0 and 1.
const recipes = (count: number) => `${count} ${count < 2 ? 'recette' : 'recettes'}`

export const strings = {
  // The page's own title, for assistive technology: the design shows the logo, not a heading.
  pageTitle: 'Il en reste un peu',
  searchPrompt: 'Chercher une recette',
  searchPromptLabel: 'Chercher une recette : ouvrir la recherche',

  categories: {
    label: 'Catégories',
    all: 'Toutes',
    loading: 'Chargement des catégories…',
  },

  feed: {
    title: 'Fraîchement ajoutées',
    subtitle: 'les dernières recettes de la famille',
    loading: 'Chargement des recettes…',
  },

  card: {
    byline: (author: string, when: string | undefined) =>
      when === undefined ? `Par ${author}` : `Par ${author} · ${when}`,
    // « +2 » is all the eye needs; assistive technology gets the sentence.
    moreTags: (count: number) => `+${count}`,
    moreTagsSpoken: (count: number) => `et ${count} ${count < 2 ? 'autre tag' : 'autres tags'}`,
  },

  loadMore: {
    action: 'Voir plus de recettes',
    waiting: 'Chargement…',
    retry: 'Réessayer',
    count: (shown: number, total: number) => `${shown} sur ${recipes(total)}`,
    incoming: (count: number) => `Chargement de ${count} recettes de plus…`,
    loaded: (count: number) => `${recipes(count)} de plus chargée${count < 2 ? '' : 's'}`,
    failed: 'Impossible de charger la suite.',
    end: (total: number) => `Tu as tout vu : ${recipes(total)}.`,
  },

  failed: {
    network: {
      title: 'Pas de connexion pour le moment',
      description: "Vérifie ta connexion internet, puis réessaie. Tes recettes t'attendent.",
    },
    // Any other cause: the sentence for that cause (failureMessage) comes under this title.
    other: { title: 'Impossible de charger les recettes' },
    retry: 'Réessayer',
  },

  empty: {
    visitor: {
      title: 'Bienvenue dans la cuisine de la famille',
      description: 'Les premières recettes arrivent bientôt. Reviens nous voir dans un moment.',
      refresh: 'Actualiser',
      refreshing: 'Actualisation…',
    },
    member: {
      title: 'Ton carnet attend sa première recette',
      description: 'Ajoute-la : une photo, les ingrédients, quelques étapes.',
      create: 'Créer une recette',
    },
  },
} as const
