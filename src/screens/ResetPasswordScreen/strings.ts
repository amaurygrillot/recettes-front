export const strings = {
  title: 'Nouveau mot de passe',
  account: 'Compte :',
  newPassword: 'Nouveau mot de passe',
  confirmation: 'Confirmer le mot de passe',
  mismatch: 'Les deux mots de passe ne sont pas identiques.',
  submit: 'Changer mon mot de passe',
  submitting: 'Modification…',
  done: {
    title: 'Mot de passe modifié',
    text: 'Mot de passe modifié. Tu peux te connecter.',
    signIn: 'Se connecter',
  },
  // One state for an unknown, an expired and an already used link, and for an address opened without
  // a token: the screen never says which, it would tell who has an account.
  invalidLink: {
    title: "Ce lien n'est plus valable",
    text: "Ce lien n'est plus valable. Il expire au bout de 15 minutes et ne sert qu'une fois.",
    askAgain: 'Demander un nouveau lien',
  },
} as const
