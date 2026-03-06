export type TechnologyCategory =
  | 'TECHNIQUES'
  | 'TOOLS'
  | 'PLATFORMS'
  | 'LANGS_FRAMEWORKS';

export type TechnologyRing = 'ADOPT' | 'TRIAL' | 'ASSESS' | 'HOLD';

export const TECHNOLOGY_CATEGORIES = [
  'TECHNIQUES',
  'TOOLS',
  'PLATFORMS',
  'LANGS_FRAMEWORKS',
] as const;

export const TECHNOLOGY_RINGS = ['ADOPT', 'TRIAL', 'ASSESS', 'HOLD'] as const;

export interface UpdateTechnology {
  name: string;
  category: TechnologyCategory;
  description: string;
}

export interface CreateTechnology extends UpdateTechnology {
  published: boolean;
  ring?: TechnologyRing;
  classificationDescription?: string;
}

export interface Technology extends CreateTechnology {
  id: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
}

export interface TechnologyList {
  id: string;
  name: string;
  published: boolean;
  category: TechnologyCategory;
  ring?: TechnologyRing;
}

export interface UpsertTechnologyClassification {
  ring: TechnologyRing;
  classificationDescription: string;
}
