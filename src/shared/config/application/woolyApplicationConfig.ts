import type { ApplicationConfig } from "./ApplicationConfig";

export const woolyApplicationConfig = {
  app: {
    id: "wooly-web",
    brandId: "wooly",
    name: "Wooly Imports",
    shortName: "Wooly",
  },
  locale: {
    language: "es",
    country: "PE",
    locale: "es-PE",
    currency: "PEN",
    currencyLocale: "es-PE",
  },
  publicSite: {
    origin: "https://www.woolyimports.com",
    domain: "woolyimports.com",
  },
  contact: {
    whatsappNumber: "51936188636",
  },
  assets: {
    logoUrl:
      "https://dl.dropboxusercontent.com/scl/fi/pnsqsg5o0v9sce32wi0n5/Logo_Wooly.png?rlkey=jjfdddx66emkv2rdh9dp4kosd&st=xbp3j3ks&raw=1",
    pdfLogoUrl: "/logo-wooly.png",
    defaultSeoImageUrl: "/og/og-catalogo.jpg",
  },
  routes: {
    catalog: "/catalogo",
    productDetail: "/catalogo/producto.html",
    catalogPdf: "/catalogo/pdf",
  },
  commerce: {
    pdfValidityDays: 7,
  },
  catalog: {
    source: "google-sheets",
  },
  integrations: {
    meta: {
      brandName: "Wooly Imports",
    },
  },
} as const satisfies ApplicationConfig;
