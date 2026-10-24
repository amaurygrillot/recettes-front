export const strings = {
  titles: { create: 'Nouvelle recette', edit: 'Modifier la recette' },
  close: "Fermer l'éditeur",
  cancel: 'Annuler',
  save: 'Enregistrer',
  saving: 'Enregistrement…',
  optional: 'facultatif',

  // The draft lives on the device only: nothing is sent before « Enregistrer ».
  draft: {
    saving: 'Enregistrement du brouillon…',
    saved: 'Brouillon enregistré sur cet appareil',
    failed: 'Brouillon non enregistré sur cet appareil',
    foundTitle: 'Reprendre ton brouillon ?',
    found: (when: string) => `Tu avais commencé une recette sur cet appareil, ${when}.`,
    resume: 'Reprendre',
    startOver: 'Recommencer',
    discardTitle: 'Effacer le brouillon ?',
    discardText: 'Le brouillon de cet appareil sera effacé. Tu repartiras d’une page vierge.',
    keep: 'Garder le brouillon',
    discard: 'Effacer le brouillon',
    resumedAfterLogin: 'Te revoilà : ton brouillon est intact.',
  },

  sections: {
    label: 'Sections du formulaire',
    information: 'Informations',
    photos: 'Photos',
    photosTitle: 'Photos de couverture',
    ingredients: 'Ingrédients',
    steps: 'Étapes',
    advice: 'Conseil',
    adviceTitle: 'Recommandations',
  },

  information: {
    title: 'Titre',
    titlePlaceholder: 'Ex. Tarte fine aux pommes',
    introduction: 'Introduction',
    introductionPlaceholder:
      'Présente ta recette en quelques phrases : d’où elle vient, quand la préparer.',
    categories: 'Catégories',
    categoriesHint: 'Au moins une. Choisis parmi les catégories existantes.',
    tags: 'Tags',
  },

  // What the two choice fields and their sheets say.
  choice: {
    category: {
      field: 'Catégories',
      choose: 'Choisir des catégories',
      add: 'Ajouter une catégorie',
      remove: (label: string) => `Retirer la catégorie ${label}`,
      sheetTitle: 'Catégories',
      search: 'Chercher une catégorie',
      existing: 'Catégories existantes',
      expand: (label: string) => `Déplier ${label}`,
      collapse: (label: string) => `Replier ${label}`,
      chosenInside: (count: number) => (count === 1 ? '1 choisie' : `${count} choisies`),
      confirm: (count: number) =>
        count === 0 ? 'Valider' : `Valider · ${count === 1 ? '1 choisie' : `${count} choisies`}`,
      noResult: (typed: string) =>
        `Aucune catégorie ne s’appelle « ${typed} ». Tu ne peux pas en créer ici.`,
    },
    tag: {
      field: 'Tags',
      choose: 'Choisir des tags',
      add: 'Ajouter un tag',
      remove: (label: string) => `Retirer le tag ${label}`,
      sheetTitle: 'Tags',
      search: 'Chercher un tag',
      existing: 'Tags existants',
      confirm: (count: number) =>
        count === 0 ? 'Valider' : `Valider · ${count === 1 ? '1 choisi' : `${count} choisis`}`,
      noResult: (typed: string) =>
        `Aucun tag ne s’appelle « ${typed} ». Tu ne peux pas en créer ici.`,
    },
    close: 'Fermer',
    clearSearch: 'Effacer la recherche',
    cancel: 'Annuler',
    results: (count: number) => (count === 1 ? '1 résultat' : `${count} résultats`),
  },

  errors: {
    titleRequired: 'Le titre est obligatoire.',
    titleTooLong: 'Trop long : 200 caractères au plus.',
    categoriesRequired: 'Choisis au moins une catégorie.',
    altTextTooLong: 'Trop long : 500 caractères au plus.',
    groupTitleTooLong: 'Trop long : 200 caractères au plus.',
    groupEmpty: 'Ajoute au moins un ingrédient à ce groupe.',
    groupsRequired: 'Ajoute au moins un groupe avec un ingrédient.',
    ingredientRequired: 'Choisis un ingrédient de la liste, ou crée-le.',
    quantityInvalid: 'La quantité doit être un nombre, par exemple 250 ou 1,5.',
    quantityNegative: 'La quantité ne peut pas être négative.',
    noteTooLong: 'La note est trop longue : 200 caractères au plus.',
    stepEmpty: 'Écris au moins une phrase pour cette étape.',
    stepsRequired: 'Ajoute au moins une étape.',
  },

  // The summary under the bar after « Enregistrer »: what is missing, with a link to each.
  summary: {
    missing: (count: number, things: string) =>
      `Il manque ${count === 1 ? '1 chose' : `${count} choses`} : ${things}.`,
    toFix: (count: number, things: string) =>
      `Il reste ${count === 1 ? '1 chose' : `${count} choses`} à corriger : ${things}.`,
    title: 'un titre',
    category: 'une catégorie',
    ingredient: 'un ingrédient',
    step: 'une étape',
    longTitle: 'un titre plus court',
    ingredientToFix: 'un ingrédient à compléter',
    stepToWrite: 'une étape à écrire',
    fieldToFix: 'un champ à corriger',
    goTo: {
      title: 'Aller au titre',
      categories: 'Aller aux catégories',
      ingredients: 'Aller aux ingrédients',
      steps: 'Aller aux étapes',
      fields: 'Aller aux champs à corriger',
    },
  },

  counter: (typed: number, max: number) => `${typed} / ${max}`,

  saved: 'Recette enregistrée.',
  saveFailure: 'Enregistrement impossible.',
}
