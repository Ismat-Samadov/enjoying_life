export interface Location {
  latitude: number;
  longitude: number;
}

export interface Flag {
  emoji: string;
  image_url: string;
}

export interface Country {
  name: string;
  iso2: string;
  capital: string;
  location: Location;
  flag: Flag;
}

export interface Concept {
  word: string;
  original_language: string;
  literal_translation: string;
  description: string;
  core_theme: string;
  tags: string[];
}

export interface Meta {
  region: string;
  category: string;
  modern_usage: boolean;
  cultural_domain: string[];
}

export interface CulturalData {
  country: Country;
  concept: Concept;
  meta: Meta;
}
