import { ArrowLeft } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { SearchInput } from "@/components/SearchInput";
import type { Product, Category } from "@/types/product";

interface CategoryHeaderProps {
  categoryInfo?: Category;
  categoryProducts: Product[];
  filteredCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
}

export function CategoryHeader({
  categoryInfo,
  categoryProducts,
  filteredCount,
  searchValue,
  onSearchChange,
  onBack,
}: CategoryHeaderProps) {
  const hasSearch = searchValue.trim().length > 0;

  return (
    <header className="sticky top-0 z-[100] w-full flex flex-col shadow-sm">
      <CountdownTimer />

      <div className="bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex items-center gap-3 min-w-0 md:shrink-0">
              <button
                onClick={onBack}
                className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-black text-foreground truncate leading-tight">
                  {categoryInfo ? `${categoryInfo.icon} ${categoryInfo.name}` : "Categoría"}
                </h1>

                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {hasSearch
                    ? `${filteredCount} resultado${filteredCount === 1 ? "" : "s"}`
                    : `${categoryProducts.length} productos`}
                </p>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <SearchInput
                value={searchValue}
                onChange={onSearchChange}
                products={categoryProducts}
                placeholder={`¿Qué buscas en ${categoryInfo?.name?.toLowerCase() || "esta categoría"}?`}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
