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

  failed: {
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
