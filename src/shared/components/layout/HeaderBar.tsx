import { SearchInput } from "@/modules/search/components/SearchInput";
import type { Product } from "@/shared/types/product";

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  products?: Product[];
}

const LOGO_URL =
  "https://dl.dropboxusercontent.com/scl/fi/pnsqsg5o0v9sce32wi0n5/Logo_Wooly.png?rlkey=jjfdddx66emkv2rdh9dp4kosd&st=xbp3j3ks&raw=1";

export function HeaderBar({
  searchQuery,
  onSearchChange,
  products = [],
}: HeaderBarProps) {
  return (
    <div className="border-b border-slate-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur-xl md:px-4 md:py-4">

      <div className="mx-auto flex max-w-7xl items-center gap-3">

        <div
          onClick={() => window.location.reload()}
          className="hidden shrink-0 cursor-pointer md:block"
        >
          <img
            src={LOGO_URL}
            alt="Wooly"
            className="h-9 w-auto"
          />
        </div>

        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            products={products}
            placeholder="Busca flores, cajas, peluches o código..."
          />
        </div>

      </div>

    </div>
  );
}