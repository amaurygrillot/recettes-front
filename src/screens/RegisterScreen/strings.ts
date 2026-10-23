export const strings = {
  title: 'Créer un compte',
  usernameHint: '3 à 50 caractères',
  usernamePlaceholder: 'Ex. odile74',
  usernameRequired: "Indique ton nom d'utilisateur.",
  usernameTooShort: 'Au moins 3 caractères.',
  usernameTooLong: 'Au plus 50 caractères.',
  emailPlaceholder: 'prenom@exemple.fr',
  firstname: 'Prénom',
  firstnamePlaceholder: 'Ex. Odile',
  lastname: 'Nom',
  lastnamePlaceholder: 'Ex. Martin',
  optional: 'facultatif',
  submit: 'Créer mon compte',
  submitting: 'Création du compte…',
  hasAccount: 'Tu as déjà un compte ? Se connecter',
  // Said by the field that is concerned (409): the one place that tells whether a name or an address is taken.
  conflict: {
    username: "Ce nom d'utilisateur est déjà pris.",
    email: 'Cette adresse e-mail est déjà utilisée.',
    // The back end named neither: a conflict all the same.
    unknown: "Ce nom d'utilisateur ou cette adresse e-mail est déjà utilisé.",
  },
  welcome: {
    title: (username: string) => `Bienvenue, ${username}\u00a0!`,
    handwritten: 'ton couvert est mis.',
    text: 'Ton compte est prêt. Tu peux chercher, lire et, quand tu veux, ajouter tes propres recettes.',
    connecting: "On t'installe à table…",
    connectingButton: 'Connexion…',
    connected: 'Te voilà connecté.',
    discover: 'Découvrir les recettes',
    // The account exists but the automatic sign-in did not work: the way in is the sign-in page.
    notConnected: 'Ton compte est créé, mais la connexion automatique a échoué.',
    signIn: 'Se connecter',
  },
} as const
