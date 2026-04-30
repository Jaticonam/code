import { SearchInput } from "@/components/SearchInput";
import type { Product } from "@/types/product";

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
    <div className="border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl md:py-4">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <div
          className="shrink-0 cursor-pointer"
          onClick={() => window.location.reload()}
        >
          <img src={LOGO_URL} alt="Wooly" className="h-8 w-auto md:h-9" />
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