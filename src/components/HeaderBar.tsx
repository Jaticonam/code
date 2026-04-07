import { Search } from "lucide-react";

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const LOGO_URL = "https://dl.dropboxusercontent.com/scl/fi/pnsqsg5o0v9sce32wi0n5/Logo_Wooly.png?rlkey=jjfdddx66emkv2rdh9dp4kosd&st=xbp3j3ks&raw=1";

export function HeaderBar({ searchQuery, onSearchChange }: HeaderBarProps) {
  return (
    <div className="bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex-shrink-0 cursor-pointer" onClick={() => window.location.reload()}>
          <img src={LOGO_URL} alt="Wooly" className="h-8 md:h-9 w-auto" />
        </div>
        <div className="flex-grow relative">
          <div className="flex items-center bg-muted rounded-xl md:rounded-2xl px-3 md:px-4 py-2.5 md:py-3 focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-transparent focus-within:border-border">
            <Search className="text-muted-foreground w-4 h-4 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="¿Qué buscas hoy?"
              className="bg-transparent border-none outline-none w-full text-[13px] md:text-sm font-bold text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
