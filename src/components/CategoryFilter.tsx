import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const scrollableCategories = categories.filter((c) => c.id !== allCategory?.id);

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

  const buttonBaseClass =
    "rounded-2xl border-2 inline-flex items-center gap-2 whitespace-nowrap font-black tracking-wide capitalize transition-all duration-300 shrink-0";

  const getButtonClass = (id: string) =>
    `${buttonBaseClass} ${
      active === id
        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.03]"
        : "bg-card border-border text-muted-foreground hover:border-muted-foreground/30"
    }`;

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden md:flex gap-3 overflow-x-auto pb-6 no-scrollbar px-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            title={c.name}
            className={`${getButtonClass(c.id)} px-5 py-3 text-[12px]`}
          >
            <span className="shrink-0">{c.icon}</span>
            <span className="max-w-[120px] truncate">{c.name}</span>
          </button>
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden px-2 pb-6">
        <div className="relative flex items-center gap-2">

          {/* Todos fijo */}
          {allCategory && (
            <button
              onClick={() => onSelect(allCategory.id)}
              title={allCategory.name}
              className={`${getButtonClass(allCategory.id)} px-4 py-2.5 text-[11px] relative z-10`}
            >
              <span className="shrink-0">{allCategory.icon}</span>
              <span className="max-w-[78px] truncate">{allCategory.name}</span>
            </button>
          )}

          {/* Contenedor deslizable */}
          <div className="relative min-w-0 flex-1">

            {/* Fade izquierdo */}
            {canScrollLeft && (
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-background to-transparent" />
            )}

            {/* Fade derecho */}
            {canScrollRight && (
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-background to-transparent" />
            )}

            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth"
            >
              {scrollableCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  title={c.name}
                  className={`${getButtonClass(c.id)} px-4 py-2.5 text-[11px]`}
                >
                  <span className="shrink-0">{c.icon}</span>
                  <span className="max-w-[90px] truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Botón SOLO derecha */}
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            aria-label="Ver más categorías"
            className={`px-3 py-2.5 rounded-2xl border-2 border-dashed bg-card text-muted-foreground ${
              canScrollRight
                ? "opacity-100"
                : "opacity-40 pointer-events-none"
            }`}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}