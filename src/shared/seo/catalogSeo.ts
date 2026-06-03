export interface SeoData {
  title: string;
  description: string;
  canonical: string;
  image: string;
}

export const DEFAULT_CATALOG_SEO: SeoData = {
  title: "Catálogo Mayorista para Emprendedores | Wooly Import Store",
  description:
    "Explora el catálogo mayorista de Wooly Import Store: flores, cajas, globos, peluches, papeles, accesorios y productos de alta rotación con envíos a todo el Perú.",
  canonical: "https://www.woolyimports.com/catalogo",
  image: "https://www.woolyimports.com/og/og-catalogo.jpg",
};

export const CATALOG_CATEGORY_SEO: Record<string, SeoData> = {
  flores: {
    title: "Flores Mayoristas en Perú | Wooly Import Store",
    description:
      "Compra flores mayoristas para florerías, emprendedores y negocios de regalos. Productos de alta rotación con envíos a todo el Perú.",
    canonical: "https://www.woolyimports.com/categorias/flores.html",
    image: "https://www.woolyimports.com/og/og-flores.jpg",
  },
  peluches: {
    title: "Peluches Mayoristas para Regalos | Wooly Import Store",
    description:
      "Peluches por mayor para emprendedores, tiendas de regalos y campañas especiales como San Valentín y Día de la Madre.",
    canonical: "https://www.woolyimports.com/categorias/peluches.html",
    image: "https://www.woolyimports.com/og/og-peluches.jpg",
  },
  papeles: {
    title: "Papeles Decorativos por Mayor | Wooly Import Store",
    description:
      "Papeles para envolver regalos, arreglos florales, detalles y empaques creativos para negocios.",
    canonical: "https://www.woolyimports.com/categorias/papeles.html",
    image: "https://www.woolyimports.com/og/og-papeles.jpg",
  },
  cajas: {
    title: "Cajas para Regalos por Mayor | Wooly Import Store",
    description:
      "Cajas decorativas y empaques para regalos, flores, detalles y emprendimientos con envíos a todo el Perú.",
    canonical: "https://www.woolyimports.com/categorias/cajas.html",
    image: "https://www.woolyimports.com/og/og-cajas.jpg",
  },
  cintas: {
    title: "Cintas Decorativas por Mayor | Wooly Import Store",
    description:
      "Cintas para regalos, arreglos, empaques y decoración comercial. Ideales para emprendedores creativos.",
    canonical: "https://www.woolyimports.com/categorias/cintas.html",
    image: "https://www.woolyimports.com/og/og-cintas.jpg",
  },
  globos: {
    title: "Globos por Mayor para Decoración | Wooly Import Store",
    description:
      "Globos para cumpleaños, celebraciones, detalles, campañas y negocios de decoración. Compra mayorista en Perú.",
    canonical: "https://www.woolyimports.com/categorias/globos.html",
    image: "https://www.woolyimports.com/og/og-globos.jpg",
  },
  accesorios: {
    title: "Accesorios para Regalos por Mayor | Wooly Import Store",
    description:
      "Accesorios decorativos para complementar regalos, arreglos, empaques y productos de alta rotación.",
    canonical: "https://www.woolyimports.com/categorias/accesorios.html",
    image: "https://www.woolyimports.com/og/og-accesorios.jpg",
  },
  llaveros: {
    title: "Llaveros por Mayor para Regalos | Wooly Import Store",
    description:
      "Llaveros y detalles pequeños para tiendas, campañas, regalos corporativos y emprendedores.",
    canonical: "https://www.woolyimports.com/categorias/llaveros.html",
    image: "https://www.woolyimports.com/og/og-llaveros.jpg",
  },
  hotwheels: {
    title: "Hot Wheels por Mayor en Perú | Wooly Import Store",
    description:
      "Autos Hot Wheels por mayor para tiendas, coleccionistas, emprendedores y negocios de juguetes.",
    canonical: "https://www.woolyimports.com/categorias/hotwheels.html",
    image: "https://www.woolyimports.com/og/og-hotwheels.jpg",
  },
};

export const getCatalogSeo = (category: string) =>
  category !== "todas" && CATALOG_CATEGORY_SEO[category]
    ? CATALOG_CATEGORY_SEO[category]
    : DEFAULT_CATALOG_SEO;
