export const strings = {
  back: 'Retour aux recettes',
  gallery: 'Photos de la recette',
  addPhoto: 'Ajouter une photo',

  // After a recipe is created, the celebrating mascot.
  published: {
    title: 'Ta recette est publiée !',
    description: 'Toute la famille peut la lire et la cuisiner.',
    see: 'Voir la recette',
    another: 'Écrire une autre recette',
  },
  byline: 'Par',
  added: (date: string) => `ajoutée le ${date}`,
  modified: (date: string) => `modifiée le ${date}`,

  ingredients: {
    title: 'Les ingrédients',
  },

  steps: {
    title: 'La préparation',
    photo: (position: number, total: number) =>
      total === 1 ? 'Agrandir la photo' : `Agrandir la photo ${position} sur ${total}`,
    none: {
      title: "Pas encore d'étapes",
      description: "L'auteur n'a pas encore écrit les étapes de cette recette. Reviens plus tard.",
    },
    stepLabel: (number: number) => `Étape ${number}`,
  },

  advice: {
    label: 'Le conseil de la cuisinière',
    title: 'le conseil de la cuisinière',
  },

  cooking: {
    start: 'Cuisiner pas à pas',
    resume: (step: number) => `Reprendre à l'étape ${step}`,
  },

  actions: {
    menu: 'Actions sur la recette',
    edit: 'Modifier',
    delete: 'Supprimer',
  },

  loading: 'Chargement de la recette…',
} as const
