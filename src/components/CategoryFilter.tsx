import { useEffect, useRef, useState } from "react";
import { Category } from "@/types/product";

interface CategoryFilterProps {
  categories: Category[];
  active: string;
  onSelect: (id: string) => void;
}

export function CategoryFilter({
  categories,
  active,
  onSelect,
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const allCategory = categories.find((c) => c.id === "all") ?? categories[0];
  const scrollableCategories = categories.filter(
    (c) => c.id !== allCategory?.id
  );

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 8);
  };

  useEffect(() => {
    updateScrollState();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [categories]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = Math.max(el.clientWidth * 0.72, 180);

    el.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const getButtonClass = (id: string) =>
    active === id
      ? "filter-chip-active scale-[1.04]"
      : "filter-chip";

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden md:flex gap-3 overflow-x-auto pb-6 no-scrollbar px-2">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            title={c.name}
            className={getButtonClass(c.id)}
          >
            <span className="shrink-0">{c.icon}</span>
            <span className="max-w-[120px] truncate tracking-tight">
              {c.name}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden px-2 pb-6">
        <div className="relative flex items-center gap-2">
          {/* Todos fijo */}
          {allCategory && (
            <button
              type="button"
              onClick={() => onSelect(allCategory.id)}
              title={allCategory.name}
              className={`${getButtonClass(allCategory.id)} relative z-10`}
            >
              <span className="shrink-0">{allCategory.icon}</span>
              <span className="max-w-[78px] truncate tracking-tight">
                {allCategory.name}
              </span>
            </button>
          )}

          {/* Contenedor deslizable */}
          <div className="relative min-w-0 flex-1">
            {canScrollLeft && (
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-[var(--w-bg)] to-transparent" />
            )}

            {canScrollRight && (
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-[var(--w-bg)] to-transparent" />
            )}

            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth"
            >
              {scrollableCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelect(c.id)}
                  title={c.name}
                  className={getButtonClass(c.id)}
                >
                  <span className="shrink-0">{c.icon}</span>
                  <span className="max-w-[90px] truncate tracking-tight">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Ver más */}
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            aria-label="Ver más categorías"
            className={[
              "inline-flex h-[42px] min-w-[42px] items-center justify-center rounded-2xl border bg-white text-lg font-black transition-all duration-200",
              "text-[var(--w-primary)] border-[#d8e2ed] hover:border-[var(--w-primary)] hover:bg-[var(--w-primary-soft)]",
              canScrollRight
                ? "opacity-100"
                : "opacity-40 pointer-events-none",
            ].join(" ")}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}