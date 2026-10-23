export const strings = {
  title: 'Mot de passe oublié',
  intro:
    "Indique l'adresse e-mail de ton compte, on t'envoie un lien pour choisir un nouveau mot de passe.",
  emailPlaceholder: 'prenom@exemple.fr',
  submit: 'Envoyer le lien',
  submitting: 'Envoi…',
  retry: 'Réessayer',
  // The one cause the design words in its own way; any other uses the sentence of its cause.
  networkFailure:
    "Impossible d'envoyer l'e-mail pour l'instant. Vérifie ta connexion, puis réessaie.",
  sent: {
    title: 'Regarde ta boîte mail',
    // The same words whether or not the address has an account: the screen must never say which.
    text: 'Si cette adresse correspond à un compte, un e-mail vient de partir. Le lien est valable 15 minutes.',
    resend: 'Renvoyer un e-mail',
    wait: (seconds: number) => `· dans ${seconds} s`,
  },
} as const
