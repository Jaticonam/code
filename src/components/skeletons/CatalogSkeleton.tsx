export function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6 px-2 md:px-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-[20px] border border-border p-2.5 md:p-4"
        >
          <div className="catalog-skeleton aspect-square rounded-[14px] mb-2.5" />
          <div className="catalog-skeleton h-4 rounded w-3/4 mx-auto mb-2" />
          <div className="catalog-skeleton h-3 rounded w-1/2 mx-auto mb-4" />
          <div className="catalog-skeleton h-8 rounded-xl" />
        </div>
      ))}
    </div>
  );
}