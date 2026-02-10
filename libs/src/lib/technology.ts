export type TechnologyCategory =
  | 'TECHNIQUES'
  | 'TOOLS'
  | 'PLATFORMS'
  | 'LANGS_FRAMEWORKS';

export type TechnologyRing = 'ADOPT' | 'TRIAL' | 'ASSESS' | 'HOLD';

export type Technology = {
  id: string;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  name: string;
  published: boolean;
  category: TechnologyCategory;
  ring: TechnologyRing;
  description: string;
  classificationDescription: string;
};
