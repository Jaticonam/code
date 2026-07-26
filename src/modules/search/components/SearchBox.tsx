import type {
 ChangeEventHandler,
 FocusEventHandler,
 KeyboardEventHandler,
 RefObject
} from "react";
import { Search,X } from "lucide-react";

interface SearchBoxProps {
 inputRef: RefObject<HTMLInputElement>;
 value: string;
 placeholder?: string;
 hasValue: boolean;
 onChange: ChangeEventHandler<HTMLInputElement>;
 onFocus: FocusEventHandler<HTMLInputElement>;
 onBlur: FocusEventHandler<HTMLInputElement>;
 onKeyDown: KeyboardEventHandler<HTMLInputElement>;
 onClear: () => void;
}

export function SearchBox({

 inputRef,
 value,
 placeholder,

 hasValue,

 onChange,
 onFocus,
 onBlur,

 onKeyDown,
 onClear

}:SearchBoxProps){

 return(

<div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-[#1d8299] focus-within:ring-4 focus-within:ring-[#1d8299]/10">

<Search className="h-5 w-5 shrink-0 text-slate-400"/>

<input

ref={inputRef}

value={value}

placeholder={placeholder}

onChange={onChange}

onFocus={onFocus}

onBlur={onBlur}

onKeyDown={onKeyDown}

className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"

/>

{hasValue&&(

<button

onClick={onClear}

className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100"

>

<X className="h-4 w-4"/>

</button>

)}

</div>

);

}
