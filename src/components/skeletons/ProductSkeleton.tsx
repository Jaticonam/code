export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-40">
      <main className="max-w-5xl mx-auto px-4 md:px-6 mt-6 md:mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
          {/* Imagen */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-3xl bg-white border border-[#e2e8f0] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-3">
              <div className="catalog-skeleton h-full w-full rounded-[22px]" />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 card-shop p-6 md:p-7 bg-white">
            {/* Título + descripción */}
            <div className="space-y-3">
              <div className="catalog-skeleton h-7 w-4/5 rounded-xl" />
              <div className="catalog-skeleton h-4 w-full rounded-full" />
              <div className="catalog-skeleton h-4 w-5/6 rounded-full" />
            </div>

            {/* Badges stock + viewers */}
            <div className="flex flex-wrap gap-3">
              <div className="catalog-skeleton h-7 w-28 rounded-full" />
              <div className="catalog-skeleton h-7 w-44 rounded-full" />
            </div>

            {/* Price tiers */}
            <div className="flex flex-wrap gap-2">
              <div className="catalog-skeleton h-12 w-[82px] rounded-2xl" />
              <div className="catalog-skeleton h-12 w-[82px] rounded-2xl" />
              <div className="catalog-skeleton h-12 w-[82px] rounded-2xl" />
              <div className="catalog-skeleton h-12 w-[82px] rounded-2xl" />
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <div className="catalog-skeleton h-6 w-8 rounded-md" />
                <div className="catalog-skeleton h-14 md:h-16 w-40 rounded-2xl" />
              </div>
              <div className="catalog-skeleton h-4 w-32 rounded-full" />
              <div className="catalog-skeleton h-4 w-56 rounded-full" />
            </div>

            {/* Cantidad */}
            <div className="flex items-center gap-4">
              <div className="catalog-skeleton h-10 w-10 rounded-xl" />
              <div className="catalog-skeleton h-12 w-24 rounded-xl" />
              <div className="catalog-skeleton h-10 w-10 rounded-xl" />
            </div>

            {/* CTA */}
            <div className="catalog-skeleton h-14 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}