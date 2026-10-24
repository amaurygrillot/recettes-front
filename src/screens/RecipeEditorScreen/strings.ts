export const strings = {
  titles: { create: 'Nouvelle recette', edit: 'Modifier la recette' },
  close: 'Fermer l’éditeur',
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

  // The photos of the cover, and of a step: the same tiles.
  photos: {
    add: 'Ajouter une photo',
    formats: 'JPEG ou PNG, 8 Mo au plus.',
    coverNote: 'La première photo sera la couverture.',
    takePhoto: 'Prendre une photo',
    gallery: 'Galerie',
    chooseFromGallery: 'Choisir dans la galerie',
    cameraInput: 'Photo à prendre',
    galleryInput: 'Photos à envoyer',
    close: 'Fermer',
    cover: 'Couverture',
    photo: (position: number) => `Photo ${position}`,
    group: (position: number, total: number) => `Photo ${position} sur ${total}`,
    remove: (position: number) => `Retirer la photo ${position}`,
    handle: (position: number) => `Déplacer la photo ${position}`,
    moveLeft: (position: number) => `Déplacer la photo ${position} vers la gauche`,
    moveRight: (position: number) => `Déplacer la photo ${position} vers la droite`,
    altText: 'Texte alternatif',
    altTextPlaceholder: 'Décris la photo',
    reorderHint:
      'Glisse une photo, ou touche les flèches, pour changer l’ordre. La première est la couverture.',
    dropHere: 'Déposer ici',
    moved: (position: number, newPosition: number, total: number) =>
      `Photo ${position} déplacée en position ${newPosition} sur ${total}`,
    lifted: (position: number, total: number) =>
      `Photo ${position} prise, sur ${total}. Utilise les flèches pour la déplacer.`,
    dropped: (position: number, total: number) => `Photo ${position} déposée, sur ${total}`,
    dragCancelled: 'Déplacement annulé',
    dragInstructions:
      'Pour déplacer une photo : appuie sur espace, utilise les flèches, puis espace pour la déposer.',
    gripRole: 'photo à déplacer',
    sending: 'Envoi…',
    sendingGroup: 'Envoi en cours',
    progress: 'Envoi de la photo',
    cancelSend: 'Annuler l’envoi',
    retry: 'Réessayer',
    retryIn: (seconds: number) => `Réessayer dans ${seconds} s`,
    giveUp: 'Retirer',
    problems: {
      format: 'JPEG ou PNG uniquement',
      size: '8 Mo maximum',
      rateLimited: (seconds: number | undefined) =>
        seconds === undefined
          ? 'Trop d’envois d’affilée, réessaie dans un instant'
          : `Trop d’envois d’affilée, réessaie dans ${seconds} secondes`,
      busy: 'Service momentanément saturé, réessaie',
    },
    stillSending: 'Une photo est encore en cours d’envoi. Réessaie dans un instant.',
    stepPhotos: 'Photos de l’étape',
  },

  // The ingredient groups and their lines.
  ingredients: {
    empty: 'Aucun ingrédient pour l’instant',
    addGroup: 'Ajouter un groupe',
    addLine: 'Ajouter un ingrédient',
    count: (count: number) => (count === 1 ? '1 ingrédient' : `${count} ingrédients`),
    untitled: 'Groupe sans titre',
    groupOf: (title: string) => (title === '' ? 'Groupe sans titre' : `Groupe ${title}`),
    rename: 'Renommer',
    addTitle: 'Ajouter un titre',
    titleField: 'Titre du groupe',
    validateTitle: 'Valider le titre',
    moveGroupUp: 'Monter le groupe',
    moveGroupDown: 'Descendre le groupe',
    removeGroup: 'Retirer le groupe',
    removeGroupTitle: 'Retirer ce groupe ?',
    removeGroupText: (title: string, count: number) =>
      `« ${title === '' ? 'Groupe sans titre' : title} » et ${count === 1 ? 'son ingrédient seront retirés' : `ses ${count} ingrédients seront retirés`} de la recette. Rien n’est supprimé tant que tu n’as pas enregistré.`,
    removeGroupConfirm: 'Retirer le groupe',
    cancel: 'Annuler',
    groupMoved: (position: number, newPosition: number, total: number) =>
      `Groupe ${position} déplacé en position ${newPosition} sur ${total}`,
    line: (position: number) => `Ingrédient ${position}`,
    grip: (position: number) => `Déplacer l’ingrédient ${position}`,
    gripRole: 'ingrédient à déplacer',
    remove: (position: number) => `Retirer l’ingrédient ${position}`,
    moveUp: (position: number) => `Monter l’ingrédient ${position}`,
    moveDown: (position: number) => `Descendre l’ingrédient ${position}`,
    lineMoved: (position: number, newPosition: number, total: number) =>
      `Ingrédient ${position} déplacé en position ${newPosition} sur ${total}`,
    lineLifted: (position: number, total: number) =>
      `Ingrédient ${position} pris, sur ${total}. Utilise les flèches pour le déplacer.`,
    lineDropped: (position: number, total: number) => `Ingrédient ${position} déposé, sur ${total}`,
    dragInstructions:
      'Pour déplacer un ingrédient : appuie sur espace, utilise les flèches, puis espace pour le déposer.',
    ingredient: 'Ingrédient',
    ingredientPlaceholder: 'Ex. farine de blé',
    suggestions: 'Ingrédients existants',
    create: (typed: string) => `Créer « ${typed} »`,
    creating: (name: string) => `Création de « ${name} »…`,
    created: 'Ingrédient créé, il est dans la liste',
    exists: (name: string) => `« ${name} » existe déjà. On l’a choisi pour toi.`,
    createFailed: (name: string) => `Impossible de créer « ${name} ». Réessaie dans un instant.`,
    quantity: 'Quantité',
    unit: 'Unité',
    noUnit: '—',
    note: 'Note',
    notePlaceholder: 'Ex. haché',
    removed: 'Ingrédient retiré.',
    undo: 'Annuler',
  },

  // The steps, one card each: the number is the rank, so reordering renumbers.
  steps: {
    step: (position: number) => `Étape ${position}`,
    textLabel: 'Texte de l’étape',
    textPlaceholder: 'Ex. Fais fondre le beurre à feu doux.',
    photosLabel: 'Photos de l’étape',
    add: 'Ajouter une étape',
    grip: (position: number) => `Déplacer l’étape ${position}`,
    gripRole: 'étape à déplacer',
    moveUp: (position: number) => `Monter l’étape ${position}`,
    moveDown: (position: number) => `Descendre l’étape ${position}`,
    remove: (position: number) => `Retirer l’étape ${position}`,
    removed: 'Étape retirée.',
    undo: 'Annuler',
    moved: (position: number, newPosition: number, total: number) =>
      `Étape ${position} déplacée en position ${newPosition} sur ${total}`,
    lifted: (position: number, total: number) =>
      `Étape ${position} prise, sur ${total}. Utilise les flèches pour la déplacer.`,
    dropped: (position: number, total: number) => `Étape ${position} déposée, sur ${total}`,
    dragInstructions:
      'Pour déplacer une étape : appuie sur espace, utilise les flèches, puis espace pour la déposer.',
    dropHint: 'Relâche la carte pour la déposer. Les numéros se mettent à jour en direct.',
  },

  // « Recommandations »: one rich text field, the cook's tip.
  advice: {
    label: 'le petit conseil',
    placeholder: 'Un geste, une astuce, ce que tu referais la prochaine fois.',
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

  loading: 'Chargement de l’éditeur…',
  loadFailed: 'Impossible d’ouvrir l’éditeur',
  referencesFailed: 'Les catégories, les tags et les unités n’ont pas pu être chargés.',
  retry: 'Réessayer',

  // Leaving with something not saved: the draft is kept, so nothing is lost either way.
  leave: {
    title: 'Quitter sans enregistrer ?',
    text: 'Tes modifications ne sont pas enregistrées dans la recette. Un brouillon est gardé sur cet appareil.',
    stay: 'Continuer à modifier',
    leave: 'Quitter',
  },

  // A whole page instead of a form that could not be saved.
  forbidden: {
    title: 'Tu n’as pas le droit de modifier cette recette.',
    text: 'Seuls son auteur et les administrateurs peuvent la modifier. Tu peux la lire, comme tout le monde.',
    toRecipe: 'Retour à la recette',
    toRecipes: 'Voir les recettes',
  },
  gone: {
    title: 'Cette recette n’existe plus.',
    text: 'Elle a été supprimée, ou le lien est ancien. Si tu y écrivais, ton brouillon reste sur cet appareil.',
    toRecipes: 'Voir les recettes',
    toHome: 'Retour à l’accueil',
  },

  deleteLink: 'Supprimer la recette',
}
