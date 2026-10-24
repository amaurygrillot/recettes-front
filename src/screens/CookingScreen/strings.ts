export const strings = {
  loading: 'Chargement du pas à pas…',

  quit: 'Quitter',
  stepOf: (step: number, total: number) => `Étape ${step} sur ${total}`,
  stamp: 'ÉTAPE',
  previous: 'Précédent',
  next: 'Suivant',
  finish: 'Terminer',

  photo: {
    zoomOne: 'Agrandir la photo',
    zoom: (position: number, total: number) => `Agrandir la photo ${position} sur ${total}`,
  },

  swipeHint: 'Glisse pour changer d’étape',

  // What the keyboard does, shown from a tablet on (the arrows and Escape).
  keys: { previous: 'Précédent', next: 'Suivant', quit: 'Quitter', escape: 'Échap' },

  ingredients: {
    title: 'Ingrédients',
    ready: (count: number, total: number) => `${count} sur ${total} prêts`,
    readyInline: (count: number, total: number) => ` · ${count} sur ${total}`,
    closePanel: 'Fermer le panneau',
    close: 'Fermer',
  },

  quitDialog: {
    title: 'Quitter le pas à pas ?',
    text: 'Tu pourras reprendre là où tu t’es arrêté.',
    stay: 'Rester',
    leave: 'Quitter',
  },

  done: {
    title: 'Bon appétit !',
    stampTop: 'bon',
    stampBottom: 'appétit !',
    finished: (count: number, title: string) =>
      count === 1
        ? `Tu as fini l’unique étape de « ${title} ».`
        : `Tu as fini les ${count} étapes de « ${title} ».`,
    tipTitle: 'le petit conseil',
    tipLabel: 'Le petit conseil',
    backToRecipe: 'Revenir à la recette',
    backToRecipes: 'Retour aux recettes',
  },

  // A recipe with no step is never opened in this mode: the recipe page says so, and so does this one if the address is typed.
  noSteps: {
    title: 'Pas encore d’étapes',
    description: 'L’auteur n’a pas encore écrit les étapes de cette recette. Reviens plus tard.',
    action: 'Revenir à la recette',
  },
} as const
