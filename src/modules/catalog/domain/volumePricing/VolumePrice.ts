import type { Product } from "@/shared/types/product";

export type VolumePriceKey =
  | "price_1"
  | "price_3"
  | "price_12"
  | "price_50"
  | "price_100";

export interface VolumePrice {
  qty: number;
  key: VolumePriceKey;
  label: string;
  className: string;
}

export interface ResolvedVolumePrice extends VolumePrice {
  unitPrice: number;
}

export interface NextVolumePrice {
  qty: number;
  unitPrice: number;
}

export interface ResolveVolumePriceOptions {
  includeBasePrice?: boolean;
}

export type VolumePriceProduct = Pick<
  Product,
  | "price_1"
  | "price_3"
  | "price_12"
  | "price_50"
  | "price_100"
  | "price_offer"
>;
