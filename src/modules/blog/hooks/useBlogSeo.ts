import { useEffect } from "react";

export function useBlogSeo({title,description,image,slug}:{title:string;description:string;image:string;slug:string}) {
  useEffect(()=>{
    const url=`https://www.woolyimports.com/blog/${slug}`;
    document.title=`${title} | Wooly Hub`;

    const setMeta=(key:string,value:string,attr:"name"|"property"="name")=>{
      let el=document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement|null;
      if(!el){el=document.createElement("meta");el.setAttribute(attr,key);document.head.appendChild(el);}
      el.content=value;
    };

    setMeta("description",description);
    setMeta("og:title",title,"property");
    setMeta("og:description",description,"property");
    setMeta("og:image",image,"property");
    setMeta("og:url",url,"property");
    setMeta("twitter:card","summary_large_image");

    let link=document.querySelector('link[rel="canonical"]') as HTMLLinkElement|null;
    if(!link){link=document.createElement("link");link.rel="canonical";document.head.appendChild(link);}
    link.href=url;
  },[title,description,image,slug]);
}
