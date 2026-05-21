import type { RefObject } from "react";
import type { Category } from "@/shared/types/product";

interface CategoryFilterMobileProps {
  allCategory?: Category;
  scrollableCategories: Category[];
  active: string;
  onSelect: (id: string) => void;
  getButtonClass: (id: string) => string;
  scrollRef: RefObject<HTMLDivElement>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollRight: () => void;
}

export function CategoryFilterMobile({
  allCategory,
  scrollableCategories,
  onSelect,
  getButtonClass,
  scrollRef,
  canScrollLeft,
  canScrollRight,
  onScrollRight,
}: CategoryFilterMobileProps) {
  return (
    <div className="md:hidden px-2 pb-6">
      <div className="relative flex items-center gap-2">
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
            {scrollableCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelect(category.id)}
                title={category.name}
                className={getButtonClass(category.id)}
              >
                <span className="shrink-0">{category.icon}</span>

                <span className="max-w-[90px] truncate tracking-tight">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onScrollRight}
          aria-label="Ver más categorías"
          className={[
            "inline-flex h-[42px] min-w-[42px] items-center justify-center rounded-2xl border bg-white text-lg font-black transition-all duration-200",
            "text-[var(--w-primary)] border-[#d8e2ed] hover:border-[var(--w-primary)] hover:bg-[var(--w-primary-soft)]",
            canScrollRight ? "opacity-100" : "opacity-40 pointer-events-none",
          ].join(" ")}
        >
          ›
        </button>
      </div>
    </div>
  );
}
