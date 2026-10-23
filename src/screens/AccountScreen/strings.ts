export const strings = {
  title: 'Compte',
  roles: { member: 'Membre', admin: 'Administrateur' },
  sections: {
    label: 'Sections du compte',
    profile: 'Profil',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
  },
  // On the card whose values were changed and not sent: nothing is lost, nothing is saved yet.
  unsaved: 'Modifications non enregistrées',
  // The title of the notification of any failure; the cause is its second line.
  failure: 'Enregistrement impossible.',
  profile: {
    title: 'Profil',
    firstname: 'Prénom',
    lastname: 'Nom',
    optional: 'facultatif',
    // The back end cannot say who is signed in (no way to read a profile): until it does, only what
    // this visit has seen is shown, and a field left empty is simply left as it is.
    unknownNames:
      "Ton prénom et ton nom ne s'affichent pas ici : laisse-les vides pour les garder tels quels.",
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    saved: 'Profil mis à jour',
  },
  // Asked by the e-mail card and by the password card, answered the same way (403 when wrong or missing).
  currentPassword: {
    label: 'Mot de passe actuel',
    required: 'Indique ton mot de passe actuel.',
    wrong: 'Le mot de passe actuel est incorrect.',
  },
  email: {
    title: 'Adresse e-mail',
    current: 'Adresse actuelle',
    unknownCurrent: "Ton adresse actuelle ne s'affiche pas ici. Tu peux la remplacer.",
    change: 'Modifier',
    newAddress: 'Nouvelle adresse e-mail',
    submit: "Changer l'adresse",
    submitting: 'Modification…',
    cancel: 'Annuler',
    changed: 'Adresse e-mail modifiée',
  },
  password: {
    title: 'Mot de passe',
    new: 'Nouveau mot de passe',
    confirmation: 'Confirmer le nouveau mot de passe',
    mismatch: 'Les deux mots de passe ne sont pas identiques.',
    submit: 'Changer le mot de passe',
    submitting: 'Modification…',
    changed: 'Mot de passe modifié',
  },
  myRecipes: 'Mes recettes',
  logout: {
    button: 'Se déconnecter',
    title: 'Te déconnecter ?',
    description: 'Tes recettes restent en sécurité. Tu pourras te reconnecter quand tu veux.',
    stay: 'Rester connecté',
    confirm: 'Se déconnecter',
  },
} as const
