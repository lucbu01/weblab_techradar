export type TechnologyCategory =
  | 'TECHNIQUES'
  | 'TOOLS'
  | 'PLATFORMS'
  | 'LANGS_FRAMEWORKS';

export type TechnologyRing = 'ADOPT' | 'TRIAL' | 'ASSESS' | 'HOLD';

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

export interface UpsertTechnologyClassification {
  ring: TechnologyRing;
  classificationDescription: string;
}
