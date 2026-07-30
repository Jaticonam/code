import type {
  KeyboardEventHandler,
} from "react";

import type {
  Product,
} from "@/shared/types/product";

import type {
  NextVolumePrice,
} from "@/shared/domain/volumePricing/VolumePricing";

import {
  getStockPresentation,
} from "@/modules/catalog";

import {
  ProductPriceBlock,
} from "./ProductPriceBlock";
import {
  ProductPurchaseActions,
} from "./ProductPurchaseActions";
import {
  ProductQuantitySelector,
} from "./ProductQuantitySelector";
import {
  ProductStockInfo,
} from "./ProductStockInfo";
import {
  ProductVolumePriceProgress,
} from "./ProductVolumePriceProgress";
import {
  ProductVolumePriceSelector,
} from "./ProductVolumePriceSelector";

interface ProductDetailCommercialSectionProps {
  product: Product;
  available: boolean;
  viewers: number;
  stockPresentation: ReturnType<typeof getStockPresentation> | null;
  canShowVolumePricing: boolean;
  canShowPricing: boolean;
  canSelectQuantity: boolean;
  effectiveQty: number;
  qtyInput: string;
  unitPrice: number;
  total: number;
  pricePulse: boolean;
  showUnlock: boolean;
  savingsByQty: number;
  nextVolumePrice: NextVolumePrice | null;
  isQtyInputValid: boolean;
  showWhatsAppButton: boolean;
  isPreventa: boolean;
  onSelectQty: (quantity: number) => void;
  onQtyInputChange: (value: string) => void;
  onQtyInputBlur: () => void;
  onQtyInputKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onWhatsApp: () => void;
  onAddToCart: () => void;
}

export function ProductDetailCommercialSection({
  product,
  available,
  viewers,
  stockPresentation,
  canShowVolumePricing,
  canShowPricing,
  canSelectQuantity,
  effectiveQty,
  qtyInput,
  unitPrice,
  total,
  pricePulse,
  showUnlock,
  savingsByQty,
  nextVolumePrice,
  isQtyInputValid,
  showWhatsAppButton,
  isPreventa,
  onSelectQty,
  onQtyInputChange,
  onQtyInputBlur,
  onQtyInputKeyDown,
  onWhatsApp,
  onAddToCart,
}: ProductDetailCommercialSectionProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-6 card-shop p-4 md:p-7 bg-white">
      <div className="mb-2 flex flex-wrap justify-center gap-2 md:justify-start">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600">
          Código: {product.id}
        </span>

        <span className="rounded-full bg-[#e6f6f8] px-3 py-1 text-[11px] font-black capitalize text-[#1d8299]">
          {product.category}
        </span>
      </div>

      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-[28px] tracking-tight font-black text-foreground leading-tight mb-3">
          {product.title}
        </h2>

        <p className="text-sm md:text-base text-[#64748b] leading-relaxed">
          {product.description}
        </p>
      </div>

      <ProductStockInfo
        product={product}
        available={available}
        viewers={viewers}
        stockPresentation={stockPresentation}
      />

      {canShowVolumePricing && (
        <ProductVolumePriceSelector
          product={product}
          effectiveQty={effectiveQty}
          onSelectQty={onSelectQty}
        />
      )}

      {canShowPricing && (
        <ProductPriceBlock
          unitPrice={unitPrice}
          total={total}
          effectiveQty={available ? effectiveQty : 1}
          pricePulse={available && pricePulse}
          showUnlock={available && showUnlock}
          savingsByQty={available ? savingsByQty : 0}
          basePrice={product.price_1}
          nextVolumePrice={available ? nextVolumePrice : null}
          isQtyInputValid={available ? isQtyInputValid : true}
        />
      )}

      {canShowVolumePricing && (
        <ProductVolumePriceProgress
          product={product}
          effectiveQty={effectiveQty}
          nextVolumePrice={nextVolumePrice}
        />
      )}

      {canSelectQuantity && (
        <ProductQuantitySelector
          value={qtyInput}
          onDecrease={() => onSelectQty(effectiveQty - 1)}
          onIncrease={() => onSelectQty(effectiveQty + 1)}
          onChange={onQtyInputChange}
          onBlur={onQtyInputBlur}
          onKeyDown={onQtyInputKeyDown}
        />
      )}

      <ProductPurchaseActions
        showWhatsAppButton={showWhatsAppButton}
        isPreventa={isPreventa}
        available={available}
        isQtyInputValid={isQtyInputValid}
        total={total}
        onWhatsApp={onWhatsApp}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}
