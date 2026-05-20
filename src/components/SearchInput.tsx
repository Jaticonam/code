import { useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Product } from "@/types/product";
import { detectCategory } from "@/lib/search/detectCategory";
import { getResultsCount } from "@/lib/search/getResultsCount";
import { getSuggestions } from "@/lib/search/getSuggestions";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";
import { useSearchUrlSync } from "@/hooks/useSearchUrlSync";
import { SearchTopSearches } from "@/components/SearchTopSearches";
import { SearchSuggestions } from "@/components/SearchSuggestions";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  useSearchShortcut(inputRef);
  useSearchUrlSync(onChange, setIsFocused, setActiveIndex);

  const hasValue = value.trim().length > 0;

  const suggestions = useMemo(
    () => getSuggestions(products, value),
    [products, value]
  );

  const detectedCategory = useMemo(
    () => detectCategory(value),
    [value]
  );

  const resultsCount = useMemo(
    () => getResultsCount(products, value),
    [products, value]
  );

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

  const handleShowResults = () => {
    setActiveIndex(-1);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleSelectTopSearch = (term: string) => {
    onChange(term);
    setIsFocused(false);
    setActiveIndex(-1);
  };

  const handleCategoryClick = () => {
    if (!detectedCategory) return;

    onChange("");
    setActiveIndex(-1);
    setIsFocused(false);

    navigate(`/catalogo/categoria.html?cat=${detectedCategory}`);
  };

  const handleClear = () => {
    onChange("");
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const canShowResultsOption = hasValue;
    const totalOptions =
      suggestions.length + (canShowResultsOption ? 1 : 0);

    if (totalOptions === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((current) =>
        current < totalOptions - 1 ? current + 1 : 0
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((current) =>
        current > 0 ? current - 1 : totalOptions - 1
      );

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        goToProduct(suggestions[activeIndex]);
        return;
      }

      handleShowResults();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();

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
          onChange={(event) => {
            onChange(event.target.value);
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
            onClick={handleClear}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isFocused && !value.trim() && (
        <SearchTopSearches onSelect={handleSelectTopSearch} />
      )}

      {isFocused && (detectedCategory || suggestions.length > 0) && (
        <SearchSuggestions
          value={value}
          hasValue={hasValue}
          detectedCategory={detectedCategory}
          suggestions={suggestions}
          resultsCount={resultsCount}
          activeIndex={activeIndex}
          onCategoryClick={handleCategoryClick}
          onProductHover={setActiveIndex}
          onProductClick={goToProduct}
          onResultsHover={() => setActiveIndex(suggestions.length)}
          onResultsClick={handleShowResults}
        />
      )}
    </div>
  );
}
