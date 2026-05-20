import type { Category } from "@/types/product";

interface CategoryFilterDesktopProps {
  categories: Category[];
  active: string;
  onSelect: (id: string) => void;
  getButtonClass: (id: string) => string;
}

export function CategoryFilterDesktop({
  categories,
  onSelect,
  getButtonClass,
}: CategoryFilterDesktopProps) {
  return (
    <div className="hidden md:flex gap-3 overflow-x-auto pb-6 no-scrollbar px-2">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          title={category.name}
          className={getButtonClass(category.id)}
        >
          <span className="shrink-0">{category.icon}</span>

          <span className="max-w-[120px] truncate tracking-tight">
            {category.name}
          </span>
        </button>
      ))}
    </div>
  );
}
