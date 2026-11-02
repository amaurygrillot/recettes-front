// French writes the singular for 0 and 1.
const recipes = (count: number) => `${count} ${count < 2 ? 'recette' : 'recettes'}`

export const strings = {
  titles: {
    search: 'Rechercher',
    mine: 'Mes recettes',
  },
  field: {
    landmark: 'Recherche de recettes',
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
  overlay: {
    title: 'Rechercher',
    search: 'Rechercher',
  },
  // The results page reached with nothing to search for (every filter taken off).
  invitation: {
    title: 'Que veux-tu cuisiner ?',
    description: 'Cherche une recette par son nom, ou choisis une catégorie ou un tag.',
    action: 'Lancer une recherche',
  },
  filters: {
    title: 'Filtres',
    button: 'Filtres',
    buttonActive: (count: number) => `Filtres, ${count} ${count < 2 ? 'actif' : 'actifs'}`,
    sections: 'Sections des filtres',
    sectionActive: (label: string, count: number) =>
      `${label}, ${count} ${count < 2 ? 'choix actif' : 'choix actifs'}`,
    reset: 'Réinitialiser',
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
    emptyMine: {
      title: 'Ajoute ta première recette',
      description: "Ici s'afficheront les recettes que tu écris, avec ou sans photo.",
      create: 'Créer ma première recette',
    },
    emptySearch: {
      title: 'Je n’ai rien trouvé…',
      descriptionFor: (query: string, hasFilters: boolean) =>
        hasFilters
          ? `Aucune recette ne contient « ${query} ». Essaie un seul mot, ou enlève un filtre.`
          : `Aucune recette ne contient « ${query} ». Essaie un seul mot.`,
      descriptionFilters:
        'Aucune recette ne correspond à ces filtres. Enlève-en un pour en voir davantage.',
      clearFilters: 'Effacer les filtres',
    },
  },
} as const
