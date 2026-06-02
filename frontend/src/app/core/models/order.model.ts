export type StatutCommande = 'en_attente' | 'confirmee' | 'en_preparation' | 'expediee' | 'livree' | 'annulee';

export interface LigneCommande {
  produit_id: number;
  produit_nom?: string;
  prix_unitaire?: number;
  quantite: number;
  sous_total?: number;
}

export interface Commande {
  id?: number;
  client_username?: string;
  lignes: LigneCommande[];
  statut?: StatutCommande;
  total?: number;
  adresse_livraison?: string;
  notes?: string;
  date_creation?: string;
  date_modification?: string;
}

export const STATUT_COMMANDE_LABELS: Record<StatutCommande, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  en_preparation: 'En préparation',
  expediee: 'Expédiée',
  livree: 'Livrée',
  annulee: 'Annulée'
};

export const STATUT_COMMANDE_COLORS: Record<StatutCommande, string> = {
  en_attente: '#d4af37',
  confirmee: '#3498db',
  en_preparation: '#e67e22',
  expediee: '#9b59b6',
  livree: '#27ae60',
  annulee: '#e74c3c'
};

export interface CartItem {
  produit_id: number;
  nom: string;
  prix: number;
  quantite: number;
  stock: number;
}
