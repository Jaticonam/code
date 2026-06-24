export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type CampaignComputedStatus =
  | "activa"
  | "programada"
  | "finalizada"
  | "borrador"
  | "oculta";

export interface Campaign {
  id: string;
  name: string;
  icon: string;

  color?: string;
  colorClass: string;

  startDate: string;
  endDate: string;
  priority: number;

  publicationStatus: string;
  computedStatus: CampaignComputedStatus;
}

export interface Product {
  id: string;

  title: string;
  description: string;

  category: string;

  price_1: number;
  price_3?: number | null;
  price_12?: number | null;
  price_50?: number | null;
  price_100?: number | null;

  price_offer?: number | null;

  stock?: number | null;
  img: string;
  gallery?: string;

  status?: string;
  badges?: string[];
  campaigns?: string[];

  priority?: number;
}
