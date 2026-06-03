import type { Product } from "@/shared/types/product";

export interface ProductSeoData {
  title: string;
  description: string;
  canonical: string;
  image: string;
}

const clean=(value?:string)=>String(value||"").trim();

export const getProductSeo=(product?:Product|null,id?:string):ProductSeoData=>{
  if(!product){
    return {
      title:"Producto mayorista | Wooly Import Store",
      description:"Explora productos mayoristas para emprendedores en Wooly Import Store.",
      canonical:`https://www.woolyimports.com/catalogo/producto.html${id?`?id=${encodeURIComponent(id)}`:""}`,
      image:"https://www.woolyimports.com/og/og-catalogo.jpg",
    };
  }

  const title=`${clean(product.title)} | Wooly Import Store`;
  const description=clean(product.description)||`Compra ${clean(product.title)} por mayor en Wooly Import Store. Productos para emprendedores con envíos a todo el Perú.`;
  const canonical=`https://www.woolyimports.com/catalogo/producto.html?id=${encodeURIComponent(product.id)}&cat=${encodeURIComponent(product.category)}`;
  const image=clean(product.img)||"https://www.woolyimports.com/og/og-catalogo.jpg";

  return {title,description,canonical,image};
};
