import { SearchInput } from "@/modules/search/components/SearchInput";
import type { Product } from "@/shared/types/product";
import type { ReactNode } from "react";
import { getApplicationConfig } from "@/shared/config/application";

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  products?: Product[];
  topContent?: ReactNode;
  bottomContent?: ReactNode;
}

const applicationConfig = getApplicationConfig();

export function HeaderBar({
  searchQuery,
  onSearchChange,
  products = [],
  topContent,
  bottomContent,
}: HeaderBarProps) {
  return (
    <div className="catalog-control-header">
      <div className="catalog-control-inner">
        <div
          onClick={() => window.location.reload()}
          className="catalog-header-logo"
        >
          <img
            src={applicationConfig.assets.logoUrl}
            alt={applicationConfig.app.shortName}
          />
        </div>

        <div className="catalog-header-campaigns">{topContent}</div>

        <div className="catalog-header-search">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            products={products}
            placeholder="Busca flores, cajas, peluches o código..."
          />
        </div>

        <div className="catalog-header-categories">{bottomContent}</div>
      </div>
    </div>
  );
}
