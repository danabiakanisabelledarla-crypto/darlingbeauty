export interface Categorie {
  id?: number;
  owner?: number;
  nom: string;
  description?: string;
  couleur?: string;
}

export interface Service {
  id?: number;
  owner?: number;
  categorie?: number;
  categorie_nom?: string;
  nom: string;
  description?: string;
  duree_minutes: number;
  prix: number;
  actif?: boolean;
  date_creation?: string;
}
