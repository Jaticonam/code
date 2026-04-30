import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/types/product";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  products?: Product[];
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  products = [],
  placeholder = "Busca productos, categorías o códigos...",
}: SearchInputProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(-1);

  const hasValue = value.trim().length > 0;

  const suggestions = useMemo(() => {
    const term = value.trim().toLowerCase();
    if (!term) return [];

    return products
      .filter((p) => {
        const title = p.title?.toLowerCase() ?? "";
        const id = p.id?.toLowerCase() ?? "";
        const category = p.category?.toLowerCase() ?? "";

        return (
          title.includes(term) ||
          id.includes(term) ||
          category.includes(term)
        );
      })
      .slice(0, 5);
  }, [value, products]);

  const goToProduct = (product: Product) => {
    const currentSearch = value.trim();

    onChange("");
    setActiveIndex(-1);

    navigate(`/catalogo/producto.html?id=${product.id}&cat=${product.category}`, {
        state: {
        fromSearch: true,
        searchQuery: currentSearch,
        },
    });
 };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        goToProduct(suggestions[activeIndex]);
      }
    }

    if (e.key === "Escape") {
      setActiveIndex(-1);
      onChange("");
    }
  };

  return (
    <div className="relative">
      <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-[#1d8299] focus-within:ring-4 focus-within:ring-[#1d8299]/10">
        <Search className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-focus-within:text-[#1d8299]" />

        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
        />

        {hasValue && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setActiveIndex(-1);
            }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-[120] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {suggestions.map((p, index) => (
            <button
              key={p.id}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => goToProduct(p)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                activeIndex === index ? "bg-slate-100" : "hover:bg-slate-50"
              }`}
            >
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                className="h-10 w-10 shrink-0 rounded-xl bg-slate-100 object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-700">
                  {p.title}
                </p>
                <p className="truncate text-[11px] font-semibold text-slate-400">
                  {p.category} · {p.id}
                </p>
              </div>

              <Search className="h-4 w-4 shrink-0 text-slate-300" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}