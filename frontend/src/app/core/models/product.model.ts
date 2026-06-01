export interface Produit {
  id?: number;
  owner?: number;
  nom: string;
  description?: string;
  marque?: string;
  prix_achat: number;
  prix_vente: number;
  stock: number;
  stock_minimum?: number;
  actif?: boolean;
  stock_bas?: boolean;
  marge?: number;
  date_creation?: string;
}
