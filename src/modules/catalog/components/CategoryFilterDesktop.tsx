import type { Category } from "@/shared/types/product";
interface CategoryFilterDesktopProps {
  categories: Category[];
  active: string;
  onSelect: (id: string) => void;
  getButtonClass: (id: string) => string;
}

export function CategoryFilterDesktop({
  categories,
  active,
  onSelect,
  getButtonClass,
}: CategoryFilterDesktopProps) {
  return (
    <div className="hidden md:flex gap-3 overflow-x-auto pb-6 no-scrollbar px-2">
      {categories.map((category, index) => (
        <button
          key={`${category.id}-${index}`}
          type="button"
          onClick={() => onSelect(category.id)}
          title={category.name}
          className={getButtonClass(category.id)}
          aria-pressed={active === category.id}
        >
          <span className="shrink-0">
            {category.icon}
          </span>

          <span className="max-w-[120px] truncate tracking-tight">
            {category.name}
          </span>
        </button>
      ))}
    </div>
  );
}