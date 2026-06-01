export type StatutRDV = 'planifie' | 'confirme' | 'en_cours' | 'termine' | 'annule' | 'absent';

export interface RendezVous {
  id?: number;
  owner?: number;
  client: number;
  service: number;
  client_nom?: string;
  service_nom?: string;
  service_duree?: number;
  date_heure: string;
  statut?: StatutRDV;
  notes?: string;
  prix_applique?: number;
  date_creation?: string;
}

export const STATUT_LABELS: Record<StatutRDV, string> = {
  planifie: 'Planifié',
  confirme: 'Confirmé',
  en_cours: 'En cours',
  termine: 'Terminé',
  annule: 'Annulé',
  absent: 'Client absent'
};

export const STATUT_COLORS: Record<StatutRDV, string> = {
  planifie: 'primary',
  confirme: 'success',
  en_cours: 'warning',
  termine: 'secondary',
  annule: 'danger',
  absent: 'dark'
};
