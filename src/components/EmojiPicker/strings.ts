export const strings = {
  search: {
    label: 'Chercher un émoji',
    clear: 'Effacer la recherche',
  },
  skinTone: {
    group: 'Ton de peau',
    /** The button that opens the six tones: it says the one in force. */
    change: (tone: string) => `Ton de peau : ${tone}, changer`,
    option: (tone: string) => `Ton de peau : ${tone}`,
    names: {
      none: 'par défaut',
      light: 'clair',
      'medium-light': 'moyennement clair',
      medium: 'moyen',
      'medium-dark': 'moyennement foncé',
      dark: 'foncé',
    },
  },
  categories: {
    navigation: 'Catégories d’émojis',
    goTo: (category: string) => `Aller à ${category}`,
    /** The nine groups of the data, under the names of the boards. */
    labels: {
      'smileys-emotion': 'Visages',
      'people-body': 'Personnes',
      'animals-nature': 'Nature',
      'food-drink': 'Cuisine',
      'travel-places': 'Voyages',
      activities: 'Activités',
      objects: 'Objets',
      symbols: 'Symboles',
      flags: 'Drapeaux',
    },
  },
  results: (count: number, search: string) => {
    if (count === 0) return `Aucun résultat pour « ${search} »`
    if (count === 1) return `1 résultat pour « ${search} »`
    return `${count.toString()} résultats pour « ${search} »`
  },
  empty: {
    title: (search: string) => `Aucun émoji pour « ${search} »`,
    description: 'Essaie un autre mot : gâteau, sapin, pizza…',
  },
  loading: 'Chargement des émojis…',
  failure: {
    message: 'Les émojis n’ont pas pu être chargés. Vérifie ta connexion, puis réessaie.',
    retry: 'Réessayer',
  },
}
