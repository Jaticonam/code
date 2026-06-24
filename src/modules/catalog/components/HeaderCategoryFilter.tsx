import type { Category } from "@/shared/types/product";
import "./HeaderCategoryFilter.css";
interface Props {
  categories: Category[];
  active: string;
  counts?: Record<string, number>;
  onSelect: (id: string) => void;
}

export function HeaderCategoryFilter({
  categories,
  active,
  counts = {},
  onSelect,
}: Props) {
  const hasCounts = Object.keys(counts).length > 0;

  const visible = hasCounts
    ? categories.filter((c) => c.id === "todas" || (counts[c.id] ?? 0) > 0)
    : categories;

  return (
    <div className="header-category-filter">
      {visible.map((c) => {
        const count = counts[c.id] ?? 0;
        const isActive = active === c.id;

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className={`header-category-chip ${isActive ? "active" : ""}`}
          >
            <span className="header-category-icon">{c.icon}</span>
            <span className="header-category-name">{c.name}</span>

            {hasCounts && (
              <span className="header-category-count">({count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
