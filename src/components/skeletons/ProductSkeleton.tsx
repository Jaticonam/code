export function ProductSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Imagen */}
        <div className="bg-card rounded-[24px] border border-border p-3 md:p-4">
          <div className="catalog-skeleton aspect-square rounded-[18px]" />
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="catalog-skeleton h-4 w-24 rounded-full" />
          <div className="catalog-skeleton h-8 w-4/5 rounded-xl" />
          <div className="catalog-skeleton h-4 w-full rounded" />
          <div className="catalog-skeleton h-4 w-5/6 rounded" />

          <div className="space-y-2 pt-2">
            <div className="catalog-skeleton h-6 w-32 rounded" />
            <div className="catalog-skeleton h-10 w-40 rounded-xl" />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <div className="catalog-skeleton h-8 w-24 rounded-full" />
            <div className="catalog-skeleton h-8 w-28 rounded-full" />
            <div className="catalog-skeleton h-8 w-24 rounded-full" />
          </div>

          <div className="space-y-3 pt-4">
            <div className="catalog-skeleton h-11 w-full rounded-xl" />
            <div className="catalog-skeleton h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}