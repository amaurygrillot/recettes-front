// French writes the singular for 0 and 1.
const recipes = (count: number) => `${count} ${count < 2 ? 'recette' : 'recettes'}`

export const strings = {
  titles: {
    search: 'Rechercher',
    mine: 'Mes recettes',
  },
  field: {
    label: 'Chercher une recette',
    landmark: 'Recherche de recettes',
    clear: 'Effacer la recherche',
    limit: (max: number) => `${max} caractères au maximum.`,
    counter: (typed: number, max: number) => `${typed} / ${max}`,
  },
  results: {
    count: recipes,
    searching: 'Recherche…',
    loading: 'Chargement des recettes…',
    // A heading for the cards, which are level 3 under the page's level 1.
    heading: 'Résultats',
  },
  // Said above the list when nothing narrows it down, naming the order the recipes come in.
  captions: {
    recent: 'Toutes les recettes, des plus récentes aux plus anciennes',
    modified: 'Toutes les recettes, les dernières modifiées en premier',
    'title-asc': 'Toutes les recettes, par titre de A à Z',
    'title-desc': 'Toutes les recettes, par titre de Z à A',
  },
  sort: {
    prefix: 'Trier :',
    title: 'Trier',
    legend: 'Trier par',
    options: {
      recent: 'Plus récentes',
      modified: 'Récemment modifiées',
      'title-asc': 'Titre A → Z',
      'title-desc': 'Titre Z → A',
    },
  },
  filters: {
    title: 'Filtres',
    button: 'Filtres',
    buttonActive: (count: number) => `Filtres, ${count} ${count < 2 ? 'actif' : 'actifs'}`,
    sections: 'Sections des filtres',
    sectionActive: (label: string, count: number) =>
      `${label}, ${count} ${count < 2 ? 'choix actif' : 'choix actifs'}`,
    reset: 'Réinitialiser',
    showRecipes: (count: number) => {
      if (count === 0) return 'Voir 0 recette'
      return count === 1 ? 'Voir la recette' : `Voir les ${recipes(count)}`
    },
    showRecipesWithoutCount: 'Voir les recettes',
    category: {
      legend: 'Catégorie',
      searchLabel: 'Chercher une catégorie',
      suggestions: 'Suggestions de catégories',
      noResult: (typed: string) => `Aucune catégorie pour « ${typed} »`,
      all: 'Toutes les catégories',
      onlyThisOne: 'Uniquement cette catégorie',
      expand: (name: string) => `Déplier ${name}`,
      collapse: (name: string) => `Replier ${name}`,
    },
    tags: {
      legend: 'Tags',
      searchLabel: 'Chercher un tag',
      suggestions: 'Suggestions de tags',
      noResult: (typed: string) => `Aucun tag pour « ${typed} »`,
    },
    author: {
      legend: 'Auteur',
      label: "Nom de l'auteur",
      placeholder: 'Ex. Odile',
      hint: 'Une partie du nom suffit.',
    },
    // In the 270 px column of a desktop the full sentence does not fit the field.
    searchShort: 'Chercher…',
    loadingOptions: 'Chargement des filtres…',
    optionsFailed: 'Les filtres ne se sont pas chargés.',
    retryOptions: 'Réessayer',
  },
  active: {
    removeFilter: (label: string) => `Retirer le filtre ${label}`,
    byAuthor: (name: string) => `Par ${name}`,
    exactCategory: (name: string) => `${name} seulement`,
    clearAll: 'Tout effacer',
    mine: 'Mes recettes',
    locked: 'verrouillé',
  },
  states: {
    failedRetry: 'Réessayer',
    emptyBase: {
      title: 'Aucune recette pour le moment',
      description: 'Les premières recettes arrivent bientôt. Reviens nous voir dans un moment.',
    },
    emptyMine: {
      title: "Tu n'as pas encore de recette",
      description: 'Ajoute ta première recette : une photo, les ingrédients, quelques étapes.',
      create: 'Créer ma première recette',
    },
    emptySearch: {
      titleFor: (query: string) => `Aucune recette pour « ${query} »`,
      titleFilters: 'Aucune recette avec ces filtres',
      description: "Vérifie l'orthographe ou retire un filtre pour en voir davantage.",
      descriptionNoFilter: "Vérifie l'orthographe ou cherche un autre mot.",
      clearFilters: 'Effacer les filtres',
    },
  },
} as const
