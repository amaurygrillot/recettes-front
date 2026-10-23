export const strings = {
  appName: 'Il en reste un peu',
  loading: 'Chargement…',

  navigation: {
    // Two landmarks exist in the page (the phone's bar and the desktop's), only one is displayed.
    phoneLabel: 'Navigation principale',
    desktopLabel: 'Navigation principale, ordinateur',
    homeLink: "Il en reste un peu, retour à l'accueil",
    home: 'Accueil',
    search: 'Rechercher',
    myRecipes: 'Mes recettes',
    account: 'Compte',
    login: 'Se connecter',
    // The round button has no visible text; the desktop button does.
    createRecipeButton: 'Créer une recette',
    newRecipe: 'Nouvelle recette',
  },

  sessionExpired: {
    title: 'Ta session a expiré.',
    description: 'Reconnecte-toi pour continuer : tu reviendras ici, là où tu en étais.',
    reconnect: 'Se reconnecter',
  },

  routeError: {
    title: "Cette page n'a pas pu s'afficher",
    description: "Quelque chose s'est mal passé de notre côté. Réessaie, ou retourne à l'accueil.",
    retry: 'Réessayer',
    backHome: "Retour à l'accueil",
  },

  // Titles of the screens that are not built yet (see ScreenPlaceholder).
  placeholder: {
    comingSoon: 'Cet écran arrive bientôt.',
    search: 'Rechercher',
    myRecipes: 'Mes recettes',
    recipe: 'Recette',
    cooking: 'Pas à pas',
    newRecipe: 'Nouvelle recette',
    editRecipe: 'Modifier la recette',
    register: 'Créer un compte',
    forgotPassword: 'Mot de passe oublié',
    resetPassword: 'Nouveau mot de passe',
    account: 'Compte',
    logout: 'Se déconnecter',
  },

  // What a failed call means for the person, one sentence per cause (api/failure.ts).
  failures: {
    network: 'Impossible de joindre le serveur. Vérifie ta connexion, puis réessaie.',
    invalidRequest: 'Certaines informations ne sont pas valides. Vérifie ta saisie, puis réessaie.',
    unauthorized: 'Connecte-toi pour continuer.',
    forbidden: "Tu n'as pas le droit de faire cette action.",
    notFound: "Cet élément n'existe pas ou a été supprimé.",
    conflict: 'Cet élément existe déjà.',
    payloadTooLarge: 'Ce fichier est trop lourd. Choisis une photo de 8 Mo au plus.',
    rateLimited: (seconds: number | undefined) =>
      seconds === undefined
        ? 'Tu vas un peu vite. Réessaie dans un instant.'
        : `Tu vas un peu vite. Réessaie dans ${seconds} ${seconds === 1 ? 'seconde' : 'secondes'}.`,
    unavailable: (seconds: number | undefined) =>
      seconds === undefined
        ? 'Le serveur est très sollicité. Réessaie dans un instant.'
        : `Le serveur est très sollicité. Réessaie dans ${seconds} ${seconds === 1 ? 'seconde' : 'secondes'}.`,
    serverError: 'Le serveur a rencontré un problème. Réessaie dans un moment.',
    unexpected: "Quelque chose s'est mal passé. Réessaie.",
  },
} as const
