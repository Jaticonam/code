import { SearchInput } from "@/modules/search/components/SearchInput";
import type { Product } from "@/shared/types/product";
import type { ReactNode } from "react";

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  products?: Product[];
  topContent?: ReactNode;
  bottomContent?: ReactNode;
}

const LOGO_URL =
  "https://dl.dropboxusercontent.com/scl/fi/pnsqsg5o0v9sce32wi0n5/Logo_Wooly.png?rlkey=jjfdddx66emkv2rdh9dp4kosd&st=xbp3j3ks&raw=1";

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
          <img src={LOGO_URL} alt="Wooly" />
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
