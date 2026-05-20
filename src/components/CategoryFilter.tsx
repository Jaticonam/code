import type { Category } from "@/types/product";

import { useCategoryScroll } from "@/hooks/useCategoryScroll";
import { CategoryFilterDesktop } from "@/components/CategoryFilterDesktop";
import { CategoryFilterMobile } from "@/components/CategoryFilterMobile";

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
  const allCategory =
    categories.find((category) => category.id === "all") ?? categories[0];

  const scrollableCategories = categories.filter(
    (category) => category.id !== allCategory?.id
  );

  const {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scrollByAmount,
  } = useCategoryScroll(categories);

  const getButtonClass = (id: string) =>
    active === id
      ? "filter-chip-active scale-[1.04]"
      : "filter-chip";

  return (
    <div className="w-full">
      <CategoryFilterDesktop
        categories={categories}
        active={active}
        onSelect={onSelect}
        getButtonClass={getButtonClass}
      />

      <CategoryFilterMobile
        allCategory={allCategory}
        scrollableCategories={scrollableCategories}
        active={active}
        onSelect={onSelect}
        getButtonClass={getButtonClass}
        scrollRef={scrollRef}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        onScrollRight={() => scrollByAmount("right")}
      />
    </div>
  );
}
