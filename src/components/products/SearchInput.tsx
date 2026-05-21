import { useMemo,useRef,useState } from "react";

import type{
Product
}
from "@/types/product";

import{
detectCategory
}
from "@/lib/search/detectCategory";

import{
getResultsCount
}
from "@/lib/search/getResultsCount";

import{
getSuggestions
}
from "@/lib/search/getSuggestions";

import{
useSearchShortcut
}
from "@/hooks/useSearchShortcut";

import{
useSearchUrlSync
}
from "@/hooks/useSearchUrlSync";

import{
useSearchNavigation
}
from "@/hooks/search/useSearchNavigation";

import{
useSearchKeyboard
}
from "@/hooks/search/useSearchKeyboard";

import{
SearchTopSearches
}
from "@/components/SearchTopSearches";

import{
SearchSuggestions
}
from "@/components/SearchSuggestions";

import{
SearchBox
}
from "@/components/search/SearchBox";

interface Props{

value:string;

onChange:(v:string)=>void;

products?:Product[];

placeholder?:string;

}

export function SearchInput({

value,
onChange,

products=[],

placeholder="Busca productos..."

}:Props){

const inputRef=
useRef<HTMLInputElement>(null);

const[
activeIndex,
setActiveIndex

]=useState(-1);

const[
isFocused,
setFocused

]=useState(false);

useSearchShortcut(
inputRef
);

useSearchUrlSync(

onChange,
setFocused,
setActiveIndex

);

const hasValue=
value.trim().length>0;

const suggestions=

useMemo(

()=>getSuggestions(
products,
value
),

[
products,
value
]

);

const detected=

useMemo(

()=>detectCategory(
value
),

[value]

);

const count=

useMemo(

()=>getResultsCount(
products,
value
),

[
products,
value
]

);

const{

goToProduct,
goToCategory

}=

useSearchNavigation(

value,
onChange,

setActiveIndex,
setFocused

);

const total=

suggestions.length+
(hasValue?1:0);

const keyboard=

useSearchKeyboard(

activeIndex,

setActiveIndex,

<<<<<<< HEAD:src/components/products/SearchInput.tsx
                <Search className="h-4 w-4 shrink-0 text-slate-300" />
              </button>
            )}
        </div>
      )}
    </div>
  );
=======
total,

suggestions.length,

()=>{

goToProduct(
suggestions[
activeIndex
]
);

},

()=>{

setFocused(false);

},

()=>{

setFocused(false);

setActiveIndex(-1);

onChange("");

}

);

return(

<div className="relative">

<SearchBox

inputRef={inputRef}

value={value}

placeholder={placeholder}

hasValue={hasValue}

onChange={(e:any)=>{

onChange(
e.target.value
);

setFocused(true);

setActiveIndex(-1);

}}

onFocus={()=>{

setFocused(true);

}}

onBlur={()=>{

setTimeout(

()=>{

setFocused(false);

},

150

);

}}

onKeyDown={keyboard}

onClear={()=>{

onChange("");

}}

/>

{isFocused
&&!hasValue&&(

<SearchTopSearches

onSelect={(term)=>{

onChange(term);

setFocused(false);

setActiveIndex(-1);

}}

/>

)}

{isFocused&&(

<SearchSuggestions

value={value}

hasValue={hasValue}

detectedCategory={detected}

suggestions={suggestions}

resultsCount={count}

activeIndex={activeIndex}

onCategoryClick={()=>{

if(
detected
){

goToCategory(
detected
);

}

}}

onProductHover={setActiveIndex}

onProductClick={goToProduct}

onResultsHover={()=>{

setActiveIndex(
suggestions.length
);

}}

onResultsClick={()=>{

setFocused(false);

}}

/>

)}

</div>

);

>>>>>>> d7e219c3a8766b0abf8f589b519322fdc6691175:src/components/SearchInput.tsx
}
