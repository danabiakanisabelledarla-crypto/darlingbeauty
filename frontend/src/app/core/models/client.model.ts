export interface Client {
  id?: number;
  owner?: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  genre: 'F' | 'M' | 'A';
  date_naissance?: string;
  adresse?: string;
  notes?: string;
  actif?: boolean;
  nom_complet?: string;
  date_creation?: string;
}
