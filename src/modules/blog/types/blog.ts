export type BlogBlockType="paragraph"|"list"|"tip"|"warning";
export type BlogTemplate="guide"|"business"|"strategy"|"campaign"|"tutorial";

export interface BlogSection{
  type?:BlogBlockType;
  title:string;
  body?:string;
  items?:string[];
}

export interface BlogArticle{
  id:string;
  slug:string;
  category:string;
  title:string;
  excerpt:string;
  image:string;
  readTime:number;
  published:string;
  relatedProducts?:string[];
  tags?:string[];
  template:BlogTemplate;
  content:BlogSection[];
  faq?:{q:string;a:string;}[];
}
