export type PdfProductPresentation =
  | "published"
  | "preventa"
  | "agotado";

export interface PdfProduct {
  id:
    string;

  title:
    string;

  description:
    string;

  category:
    string;

  image:
    string;

  price1:
    number;

  price3?:
    number |
    null;

  price12?:
    number |
    null;

  price50?:
    number |
    null;

  price100?:
    number |
    null;

  offerPrice?:
    number |
    null;

  primaryPrice:
    number;

  stock?:
    number |
    null;

  stockLabel:
    string;

  presentation:
    PdfProductPresentation;

  showPricing:
    boolean;

  showWholesalePricing:
    boolean;

  status?:
    string;

  priority:
    number;
}
