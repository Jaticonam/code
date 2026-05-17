import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Product } from "@/types/product";

const TOP_SEARCHES = ["rosas", "cajas", "peluches", "papel coreano", "cintas"];
const CATEGORY_ALIASES: Record<string, string[]> = {
  flores: ["rosas", "flor", "ramo", "tulipan"],
  peluches: ["peluche", "muñeco", "stitch"],
  cajas: ["caja", "box", "empaque"],
  papeles: ["papel", "papel coreano", "envoltura"],
  globos: ["globo", "globos"],
  accesorios: ["accesorio", "extra"],
};

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
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  // 🚀 INYECCIÓN DESDE URL (pegar aquí)
    useEffect(() => {
    const term = searchParams.get("search");

    if (term) {
      onChange(term.trim());
      setIsFocused(false);
      setActiveIndex(-1);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // 🚫 si ya está escribiendo, no hacer nada
      if (isTyping) return;

      // 🔥 tecla "/"
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

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

  const detectedCategory = useMemo(() => {
    const term = value.trim().toLowerCase();

    if (!term) return null;

    for (const [category, aliases] of Object.entries(CATEGORY_ALIASES)) {
      if (aliases.some((alias) => term.includes(alias))) {
        return category;
      }
    }

    return null;
  }, [value]);

  const resultsCount = useMemo(() => {
    const term = value.trim().toLowerCase();
    if (!term) return 0;

    return products.filter((p) => {
      const title = p.title?.toLowerCase() ?? "";
      const id = p.id?.toLowerCase() ?? "";
      const category = p.category?.toLowerCase() ?? "";

      return (
        title.includes(term) ||
        id.includes(term) ||
        category.includes(term)
      );
    }).length;
  }, [value, products]);

  const goToProduct = (product: Product) => {
    const currentSearch = value.trim();

    onChange("");
    setActiveIndex(-1);
    setIsFocused(false);

    navigate(`/catalogo/producto.html?id=${product.id}&cat=${product.category}`, {
      state: {
        fromSearch: true,
        searchQuery: currentSearch,
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const canShowResultsOption = hasValue;
    const totalOptions = suggestions.length + (canShowResultsOption ? 1 : 0);

    if (totalOptions === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < totalOptions - 1 ? prev + 1 : 0));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalOptions - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      // ✅ Producto seleccionado
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        goToProduct(suggestions[activeIndex]);
        return;
      }

      // ✅ Ver todos los resultados / búsqueda normal
      setActiveIndex(-1);
      setIsFocused(false);
      e.currentTarget.blur();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setActiveIndex(-1);
      setIsFocused(false);
      onChange("");
    }
  };

  return (
    <div className="relative">
      <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-[#1d8299] focus-within:ring-4 focus-within:ring-[#1d8299]/10">
        <Search className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-focus-within:text-[#1d8299]" />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setActiveIndex(-1);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
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

      {isFocused && !value.trim() && (
        <div className="absolute left-0 right-0 top-full z-[120] mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
            🔥 Más buscados
          </p>

          <div className="flex flex-wrap gap-2">
            {TOP_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  onChange(term);
                  setIsFocused(false);
                  setActiveIndex(-1);
                }}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {isFocused && (detectedCategory || suggestions.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-[120] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

          {/* 🔥 Categoría detectada */}
          {detectedCategory && hasValue && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setActiveIndex(-1);
                setIsFocused(false);
                navigate(`/catalogo/categoria.html?cat=${detectedCategory}`);
              }}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50 border-b border-slate-100"
            >
              <div>
                <p className="text-sm font-black text-slate-700">
                  📂 Ver categoría {detectedCategory}
                </p>
                <p className="text-[11px] font-semibold text-slate-400">
                  Coincide con tu búsqueda
                </p>
              </div>

              <Search className="h-4 w-4 shrink-0 text-slate-300" />
            </button>
          )}

          {/* 🔍 Productos */}
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
          {/* 🔥 NUEVO: VER TODOS LOS RESULTADOS */}
            {hasValue && (
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(suggestions.length)}
                onClick={() => {
                  setActiveIndex(-1);
                  setIsFocused(false);
                }}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left border-t border-slate-100 transition ${
                  activeIndex === suggestions.length
                    ? "bg-[#e6f2f5]"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div>
                  <p className="text-sm font-black text-[#1d8299]">
                    🔎 Ver {resultsCount} resultado{resultsCount !== 1 ? "s" : ""}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Explorar resultados para “{value}”
                  </p>
                </div>

                <Search className="h-4 w-4 shrink-0 text-slate-300" />
              </button>
            )}
        </div>
      )}
    </div>
  );
}
