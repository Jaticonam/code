import { Category } from "@/types/product";

interface CategoryFilterProps {
  categories: Category[];
  active: string;
  onSelect: (id: string) => void;
}

export function CategoryFilter({ categories, active, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar px-2">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`px-6 py-3 rounded-2xl text-[12px] font-black whitespace-nowrap border-2 flex items-center gap-2 transition-all duration-300 capitalize tracking-wide ${
            active === c.id
              ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
              : "bg-card border-border text-muted-foreground hover:border-muted-foreground/30"
          }`}
        >
          <span>{c.icon}</span> {c.name}
        </button>
      ))}
    </div>
  );
}
