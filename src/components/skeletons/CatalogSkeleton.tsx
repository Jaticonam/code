export function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6 px-2 md:px-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-[24px] border border-[#e2e8f0] p-3 md:p-4 shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
        >
          {/* Imagen */}
          <div className="relative mb-3">
            <div className="catalog-skeleton aspect-square rounded-[18px]" />

            {/* Badge simulado */}
            <div className="absolute top-2 left-2 catalog-skeleton h-5 w-16 rounded-full" />
          </div>

          {/* Título */}
          <div className="catalog-skeleton h-4 w-[85%] rounded mb-2" />

          {/* Código / subtítulo */}
          <div className="catalog-skeleton h-3 w-[60%] rounded mb-3" />

          {/* Precio */}
          <div className="catalog-skeleton h-5 w-20 rounded mb-3" />

          {/* Botones */}
          <div className="flex gap-2">
            <div className="catalog-skeleton h-9 w-full rounded-xl" />
            <div className="catalog-skeleton h-9 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
