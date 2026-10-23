// French writes the singular for 0 and 1.
const inSeconds = (seconds: number) => `${seconds} ${seconds < 2 ? 'seconde' : 'secondes'}`

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
    // One name for the « + » whether it shows its text or only the plus (a visible label has to be
    // part of the accessible name, and the name should not change as the page scrolls).
    newRecipe: 'Nouvelle recette',
    searchField: 'Chercher une recette',
    // The bar and the search page both have a search landmark: they need different names.
    searchLandmark: 'Recherche dans la barre',
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
  },

  // The stack of notifications.
  notifications: 'Notifications',
  retry: 'Réessayer',

  // What the entry screens (sign-in, registration, forgotten and new password) say the same way.
  auth: {
    back: 'Retour',
    backToLogin: 'Retour à la connexion',
    forgotPassword: 'Mot de passe oublié ?',
    usernameLabel: "Nom d'utilisateur",
    usernameHint: '3 à 50 caractères',
    usernameRequired: "Indique ton nom d'utilisateur.",
    usernameTooShort: 'Au moins 3 caractères.',
    usernameTooLong: 'Au plus 50 caractères.',
    // What a 409 says, on the field it is about (registration and account changes).
    conflict: {
      username: "Ce nom d'utilisateur est déjà pris.",
      email: 'Cette adresse e-mail est déjà utilisée.',
    },
    emailLabel: 'Adresse e-mail',
    emailPlaceholder: 'prenom@exemple.fr',
    emailRequired: 'Indique ton adresse e-mail.',
    emailInvalid: "Cette adresse e-mail n'a pas l'air valide. Exemple : prenom@exemple.fr",
    passwordLabel: 'Mot de passe',
    // The rule is also its own error: same words, another state.
    passwordRule: '8 caractères minimum',
    passwordTooLong: '50 caractères au plus.',
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
        : `Tu vas un peu vite. Réessaie dans ${inSeconds(seconds)}.`,
    unavailable: (seconds: number | undefined) =>
      seconds === undefined
        ? 'Le serveur est très sollicité. Réessaie dans un instant.'
        : `Le serveur est très sollicité. Réessaie dans ${inSeconds(seconds)}.`,
    serverError: 'Le serveur a rencontré un problème. Réessaie dans un moment.',
    unexpected: "Quelque chose s'est mal passé. Réessaie.",
  },

  // A list of recipes that cannot be loaded (home and search): having no connection is the one
  // cause the design words in its own way; any other uses the sentence of its cause.
  feedFailures: {
    network: {
      title: 'Pas de connexion pour le moment',
      description: "Vérifie ta connexion internet, puis réessaie. Tes recettes t'attendent.",
    },
    otherTitle: 'Impossible de charger les recettes',
    nextPage: 'Impossible de charger la suite.',
  },
} as const
