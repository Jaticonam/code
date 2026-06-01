import { ArrowLeft, FolderOpen } from "lucide-react";
import { CountdownTimer } from "@/shared/components/commerce/CountdownTimer";
import { SearchInput } from "@/modules/search/components/SearchInput";
import type { Product, Category } from "@/shared/types/product";

interface CategoryHeaderProps {
  categoryInfo?: Category;
  categoryProducts: Product[];
  filteredCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
  onOpenCategories?: () => void;
}

export function CategoryHeader({
  categoryInfo,
  categoryProducts,
  filteredCount,
  searchValue,
  onSearchChange,
  onBack,
  onOpenCategories,
}: CategoryHeaderProps) {
  const hasSearch = searchValue.trim().length > 0;
  const title = categoryInfo?.name || "Categoría";
  const count = hasSearch ? filteredCount : categoryProducts.length;

  return (
    <header className="sticky top-0 z-[100] flex w-full flex-col shadow-sm">
      <CountdownTimer />

      <div className="border-b border-border bg-card/95 px-4 py-3 backdrop-blur-xl md:py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          <div className="grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={onBack}
                className="shrink-0 rounded-xl bg-muted p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-black leading-tight text-foreground md:text-xl">
                  {title}
                </h1>

                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {count}{" "}
                  {hasSearch
                    ? `resultado${count === 1 ? "" : "s"}`
                    : "productos"}
                </p>
              </div>
            </div>

            <SearchInput
              value={searchValue}
              onChange={onSearchChange}
              products={categoryProducts}
              placeholder={`¿Qué buscas en ${title.toLowerCase()}?`}
            />

            {onOpenCategories && (
              <button
                type="button"
                onClick={onOpenCategories}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary/10 px-4 py-3 text-sm font-black text-primary transition hover:bg-primary/15"
              >
                <FolderOpen className="hidden h-4 w-4 md:block" />
                <span className="md:hidden">Categorías</span>
                <span className="hidden md:inline">Ver categorías</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
