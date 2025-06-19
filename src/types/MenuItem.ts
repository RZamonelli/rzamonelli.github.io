export interface MenuItem {
  id: string;
  name: string;
  description: string;
  group: {
    id: string;
    emoji: string;
    name: string;
    description: string;
  };
  isAvailable: boolean;
  image?: string;
  order?: number;
  translations?: {
    en?: {
      name: string;
      description: string;
    };
    es?: {
      name: string;
      description: string;
    };
  };
}

export type Language = 'pt' | 'en' | 'es';

export const defaultLanguage: Language = 'pt';

export interface MenuGroup {
  id: string;
  emoji: string;
  name: string;
  description: string;
  order?: number;
  translations?: {
    en?: {
      name: string;
      description: string;
    };
    es?: {
      name: string;
      description: string;
    };
  };
}
