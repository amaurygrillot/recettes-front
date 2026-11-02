export const strings = {
  toolbar: 'Mise en forme du texte',
  size: (current: string) => `Taille du texte : ${current}`,
  sizeNames: { small: 'Petit', normal: 'Normal', large: 'Grand' },
  bold: 'Gras',
  italic: 'Italique',
  underline: 'Souligné',
  strikethrough: 'Barré',
  bulletList: 'Liste à puces',
  numberList: 'Liste numérotée',
  undo: 'Annuler la dernière action',
  redo: 'Rétablir',

  // The writing mode: the text on a screen of its own.
  writeFullScreen: 'Écrire en plein écran',
  fullScreenLabel: 'Plein écran',
  writing: {
    done: 'Terminé',
    back: 'Fermer le mode écriture',
    escapeHint: 'Échap pour revenir à la recette',
  },
} as const
