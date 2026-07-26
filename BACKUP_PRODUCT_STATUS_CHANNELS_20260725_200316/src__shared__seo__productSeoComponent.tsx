import { Helmet } from "react-helmet-async";
import type { Product } from "@/shared/types/product";
import type { ProductSeoData } from "@/shared/seo/productSeo";

interface Props {
  seo: ProductSeoData;
  product?: Product | null;
}

const availability=(product?:Product|null)=>{
  const status=(product?.status||"").trim().toLowerCase();
  if(status==="preventa") return "https://schema.org/PreOrder";
  if(product && product.stock>0) return "https://schema.org/InStock";
  return "https://schema.org/OutOfStock";
};

export function ProductSeo({seo,product}:Props){
  const schema=product?{
    "@context":"https://schema.org",
    "@type":"Product",
    "name":product.title,
    "description":product.description,
    "sku":product.id,
    "image":[product.img],
    "category":product.category,
    "brand":{"@type":"Brand","name":"Wooly Import Store"},
    "offers":{
      "@type":"Offer",
      "url":seo.canonical,
      "priceCurrency":"PEN",
      "price":product.price_1 || product.price_3 || product.price_12 || 0,
      "availability":availability(product),
      "itemCondition":"https://schema.org/NewCondition"
    }
  }:null;

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description}/>
      <link rel="canonical" href={seo.canonical}/>

      <meta property="og:type" content="product"/>
      <meta property="og:title" content={seo.title}/>
      <meta property="og:description" content={seo.description}/>
      <meta property="og:url" content={seo.canonical}/>
      <meta property="og:image" content={seo.image}/>

      <meta name="twitter:title" content={seo.title}/>
      <meta name="twitter:description" content={seo.description}/>
      <meta name="twitter:image" content={seo.image}/>

      {schema&&(
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
