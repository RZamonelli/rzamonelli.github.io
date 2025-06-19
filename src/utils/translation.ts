interface TranslatedText {
  pt: string;
  en?: string;
  es?: string;
}

export const createTranslatedText = (pt: string): TranslatedText => ({
  pt,
  // You can integrate with a translation API here
  en: undefined,
  es: undefined,
});

export const createMenuGroup = (
  id: string,
  emoji: string,
  namePt: string,
  descriptionPt: string,
  order?: number
) => ({
  id,
  emoji,
  name: createTranslatedText(namePt),
  description: createTranslatedText(descriptionPt),
  order,
});

export const createMenuItem = (
  id: string,
  namePt: string,
  descriptionPt: string,
  price: number,
  groupId: string,
  groupEmoji: string,
  groupNamePt: string,
  groupDescriptionPt: string,
  isAvailable = true,
  image?: string,
  order?: number
) => ({
  id,
  name: createTranslatedText(namePt),
  description: createTranslatedText(descriptionPt),
  price,
  group: createMenuGroup(groupId, groupEmoji, groupNamePt, groupDescriptionPt),
  isAvailable,
  image,
  order,
});
