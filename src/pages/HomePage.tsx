import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Flower2, Heart, ScrollText, Package, Ribbon, Circle, Puzzle, Car,
  ShoppingBag, MessageCircle, Send, Truck, CreditCard, Eye, Layers,
  RotateCw, ShieldCheck, Store, Headphones, MapPin, Star, Quote,
  Sparkles, Video, Users, ChevronRight, Zap,
} from "lucide-react";

/* ── Animated counter hook ── */
function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!start || ran.current) return;
    ran.current = true;
    const t0 = performance.now();
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(target * ease));
      if (p < 1) requestAnimationFrame(tick);
      else setValue(target);
    }
    requestAnimationFrame(tick);
  }, [start, target, duration]);

  return value;
}

/* ── Stat box ── */
function StatBox({ target, label, color, started }: { target: number; label: string; color: string; started: boolean }) {
  const val = useCountUp(target, 1800, started);
  return (
    <div className="group bg-card rounded-[22px] p-6 md:p-[30px_18px] text-center border border-border relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
      <div className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-300" style={{ background: color }} />
      <span className="block text-2xl md:text-[1.6rem] font-extrabold leading-none transition-transform group-hover:scale-105" style={{ color }}>
        +{val.toLocaleString("es-PE")}
      </span>
      <span className="text-[0.8rem] text-muted-foreground font-semibold">{label}</span>
    </div>
  );
}

/* ── Categories data ── */
const CATEGORIES = [
  { id: "flores", label: "Flores & rosas", icon: Flower2, cls: "c-pink" },
  { id: "peluches", label: "Peluches top", icon: Heart, cls: "c-teal" },
  { id: "papeles", label: "Papel coreano", icon: ScrollText, cls: "c-gold" },
  { id: "cajas", label: "Cajas & bolsas", icon: Package, cls: "c-soft" },
  { id: "cintas", label: "Cintas & decoración", icon: Ribbon, cls: "c-pink" },
  { id: "globos", label: "Globos varios", icon: Circle, cls: "c-teal" },
  { id: "accesorios", label: "Accesorios & Herramientas", icon: Puzzle, cls: "c-gold" },
  { id: "hotwheels", label: "HotWheels Colección", icon: Car, cls: "c-soft" },
];

const COLOR_MAP: Record<string, { icon: string; bg: string }> = {
  "c-pink": { icon: "hsl(338 83% 73%)", bg: "#fff0f7" },
  "c-teal": { icon: "hsl(191 67% 36%)", bg: "#e8f6f9" },
  "c-gold": { icon: "hsl(39 91% 55%)", bg: "#fff8e6" },
  "c-soft": { icon: "#9b59b6", bg: "#f5eef8" },
};

/* ── Stats data ── */
const STATS = [
  { target: 1500, label: "Emprendedores atendidos", color: "#1D8298" },
  { target: 800, label: "Productos varios", color: "#F391A0" },
  { target: 39, label: "Ciudades alcanzadas", color: "#F9B233" },
  { target: 3800, label: "Pedidos despachados", color: "#6A5A8A" },
];

/* ── VIP benefits ── */
const VIP_BENEFITS = [
  { icon: Zap, title: "Precios por cajón y preventas", desc: "Compra con mejores precios y asegura mercadería antes de su llegada." },
  { icon: Video, title: "Videollamadas de compra directa", desc: "Te mostramos los productos en tiempo real para que compres con mayor seguridad." },
  { icon: Users, title: "Grupo VIP de WhatsApp", desc: "Recibe información prioritaria sobre preventas, promociones y oportunidades." },
];

/* ── Main component ── */
export default function HomePage() {
  /* Scroll-reveal */
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mainRef.current) return;
    const els = mainRef.current.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("revealed"); } }),
      { threshold: 0.05 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Stats counter trigger */
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsStarted(true); obs.disconnect(); } }, { threshold: 0.35 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-[100] bg-background/85 backdrop-blur-xl border-b border-border/30 py-3 text-center">
        <img
          src="https://dl.dropboxusercontent.com/scl/fi/pnsqsg5o0v9sce32wi0n5/Logo_Wooly.png?rlkey=jjfdddx66emkv2rdh9dp4kosd&st=xbp3j3ks&raw=1"
          alt="Wooly Import"
          className="h-[42px] mx-auto"
        />
      </header>

      {/* --- HERO --- */}
      <section className="py-8 text-center animate-[fadeInUp_0.8s_ease-out] px-4">
        <div className="max-w-[600px] mx-auto">
          <span className="inline-block text-sm font-extrabold uppercase tracking-[2px] mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-[length:300%_auto] bg-clip-text text-transparent animate-[gradientFlow_4s_linear_infinite] relative after:block after:w-10 after:h-[3px] after:bg-secondary after:mx-auto after:mt-1 after:rounded-full">
            ¡Hola, Bienvenido!
          </span>

          {/* Dot loader */}
          <div className="flex justify-center gap-3 my-4">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-float" style={{ animationDelay: "0s" }} />
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-float" style={{ animationDelay: "0.3s" }} />
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-float" style={{ animationDelay: "0.6s" }} />
          </div>

          <h1 className="text-[clamp(2.2rem,9vw,3.2rem)] font-extrabold leading-[1.05] tracking-tighter text-primary mb-4">
          Convierte insumos en ventas <br />
          <span className="bg-gradient-to-br from-secondary to-[#ff9eb5] bg-clip-text text-transparent">
            desde tu primera caja
          </span>
        </h1>

          <div className="reveal bg-accent/10 border border-accent/20 rounded-[20px] p-4 mb-8 text-sm font-semibold text-foreground">
          🚀 Diseñado para emprendedores que quieren vender más sin complicarse
        </div>

          {/* Simple process bar */}
          <div className="reveal flex items-center justify-between bg-card rounded-[25px] p-5 shadow-sm mb-8">
            <ProcessStep icon={Eye} title="Explora" sub="Mira productos" />
            <ChevronRight className="w-4 h-4 text-secondary opacity-50 shrink-0" />
            <ProcessStep icon={ShoppingBag} title="Compra" sub="Haz tu pedido" />
            <ChevronRight className="w-4 h-4 text-secondary opacity-50 shrink-0" />
            <ProcessStep icon={Truck} title="Recibe" sub="En todo el Perú" />
          </div>

          {/* CTA grid */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            <Link
              to="/catalogo"
              className="relative rounded-[22px] py-5 px-3 font-extrabold text-[0.95rem] flex flex-col items-center gap-2 bg-gradient-to-br from-secondary to-[hsl(338_83%_73%)] text-secondary-foreground shadow-[0_10px_20px_rgba(242,134,190,0.4)] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl group"
            >
              <ShineOverlay />
              <ShoppingBag className="w-5 h-5" />
              Ver catálogo
            </Link>
            <a
              href="https://wa.me/c/51936188636"
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-[22px] py-5 px-3 font-extrabold text-[0.95rem] flex flex-col items-center gap-2 bg-gradient-to-br from-primary to-[#30a5c0] text-primary-foreground shadow-[0_10px_20px_rgba(29,130,153,0.3)] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <ShineOverlay />
              <MessageCircle className="w-5 h-5" />
              Comprar por WhatsApp
            </a>
          </div>

          <div className="reveal bg-[#e0f2f1] text-primary py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide">
            Venta por mayor • Envíos a todo el Perú • Atención rápida
          </div>
        </div>
      </section>

      {/* --- CATEGORÍAS --- */}
      <section className="max-w-[600px] mx-auto px-4 mb-12">
        <SectionHeader title="🚀 Compra rápida por Categorías" subtitle="Explora nuestras categorías y encuentra al instante los productos que realmente necesitas. ¡Todo organizado para que tu compra sea rápida y fácil!" />
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const colors = COLOR_MAP[cat.cls];
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/catalogo/categoria.html?cat=${cat.id}`}
                className="reveal group bg-card rounded-[24px] p-5 text-center shadow-sm flex flex-col items-center transition-all hover:-translate-y-2 hover:shadow-md"
              >
                <div
                  className="w-[58px] h-[58px] rounded-[20px] flex items-center justify-center mb-3 transition-all group-hover:scale-110 group-hover:-rotate-[8deg]"
                  style={{ background: colors.bg, color: colors.icon }}
                >
                  <Icon className="w-6 h-6 transition-colors group-hover:text-primary-foreground" />
                </div>
                <span className="font-bold text-[0.95rem] text-foreground">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* --- PROCESO PASO A PASO --- */}
      <section className="max-w-[600px] mx-auto px-4 mb-12">
        <SectionHeader title="¿Ya sabes como comprar en Wooly?" subtitle="Realizar tu pedido es muy sencillo, te explico en  5 pasos:" />
        <div className="reveal bg-card rounded-[35px] p-8 shadow-sm space-y-6">
          {[
            { n: 1, t: "Apertura tu caja mayorista 📦", d: "Comienza tu pedido mayorista desde S/ 30. Luego entra al catálogo o escríbenos por WhatsApp y elige lo que necesitas." },
            { n: 2, t: "Acumula tu caja a tu ritmo 🛒", d: "Agrega productos desde 3, 12 unidades o por cajón. Cuando tengas todo listo, dale en enviar pedido." },
            { n: 3, t: "Recibe tu cotización 💌", d: "Te enviamos el detalle completo con precios claros para que revises y confirmes las cantidades y que todo esté correcto." },
            { n: 4, t: "Confirma y paga 💳", d: "Realiza tu pago por el medio que prefieras (Yape o Transferencia BCP) y comparte tus datos de envío de forma segura." },
            { n: 5, t: "Enviamos a tu ciudad 🚚", d: "Preparamos y alistamos tu pedido, embalamos con cuidado y lo enviamos con seguro de caja por Shalom Pro." }
          ].map((s) => (
            <div key={s.n} className="flex gap-5">
              <div className="w-10 h-10 rounded-xl bg-secondary/30 text-secondary-foreground flex items-center justify-center font-extrabold shrink-0">{s.n}</div>
              <div>
                <h3 className="font-bold text-foreground">{s.t}</h3>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PILARES --- */}
      <section className="max-w-[600px] mx-auto px-4 mb-12">
        <SectionHeader title="Nuestros Pilares" subtitle="Por qué miles de emprendedores nos eligen" />
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Layers, text: "Variedad de productos" },
            { icon: RotateCw, text: "Alta rotación" },
            { icon: ShieldCheck, text: "Calidad garantizada" },
            { icon: Store, text: "Todo en un solo lugar" },
            { icon: Headphones, text: "Soporte 24/7" },
            { icon: MapPin, text: "Envíos a todo el Perú" },
          ].map((p, i) => (
            <div key={i} className="reveal flex items-center gap-3 bg-card rounded-[22px] p-4 shadow-sm border border-border/30">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-[#e0f2f1] text-primary flex items-center justify-center shrink-0">
                <p.icon className="w-4 h-4" />
              </div>
              <span className="text-[0.85rem] font-bold text-foreground leading-tight">{p.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- ESTADÍSTICAS --- */}
      <section ref={statsRef} className="max-w-[600px] mx-auto px-4 mb-12 text-center">
        <SectionHeader title="Resultados que respaldan tu compra" subtitle="Movimiento real, clientes reales y pedidos que sí salen." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <StatBox key={i} {...s} started={statsStarted} />
          ))}
        </div>
      </section>

      {/* --- VIP --- */}
      <section className="px-4 py-16">
        <div className="max-w-[980px] mx-auto bg-card rounded-[30px] border border-border/60 shadow-xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Glow circles */}
          <div className="absolute -top-20 -right-20 w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(245,176,37,0.14),transparent_65%)] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(247,177,214,0.14),transparent_68%)] pointer-events-none" />

          <span className="reveal relative z-10 inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-bold uppercase tracking-wider mb-3">
            acceso preferencial
          </span>
          <h2 className="reveal relative z-10 text-[clamp(1.65rem,5vw,2.2rem)] font-extrabold text-foreground mb-3">
            Mayoristas <span className="text-accent">VIP</span>
          </h2>
          <p className="reveal relative z-10 max-w-[620px] mx-auto text-muted-foreground mb-4">
            Accede a mejores condiciones de compra, atención directa y beneficios exclusivos para tu negocio.
          </p>
          <div className="reveal relative z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-sm font-semibold text-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-aura" />
            Los ingresos VIP se habilitan por grupos para mantener atención rápida y ordenada.
          </div>

          <div className="reveal relative z-10 grid md:grid-cols-3 gap-4 mb-8">
            {VIP_BENEFITS.map((b, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-[20px] p-5 text-left shadow-sm transition-all hover:-translate-y-1.5 hover:border-accent/25 hover:shadow-md">
                <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-3">
                  <b.icon className="w-5 h-5" />
                </div>
                <strong className="block text-[0.95rem] font-bold text-foreground mb-2">{b.title}</strong>
                <p className="text-[0.82rem] text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/51936188636?text=Hola,%20quiero%20ser%20mayorista%20VIP"
            target="_blank"
            rel="noopener noreferrer"
            className="reveal relative z-10 inline-block px-8 py-4 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold shadow-[0_14px_30px_rgba(29,130,153,0.22)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(242,134,190,0.28)]"
          >
            Quiero ser mayorista ahora
          </a>
          <p className="reveal relative z-10 mt-3 text-xs text-muted-foreground">Acceso inmediato por WhatsApp con atención rápida y directa.</p>
        </div>
      </section>

      {/* --- TESTIMONIOS --- */}
      <section className="max-w-[600px] mx-auto px-4 mb-12">
        <SectionHeader title="Emprendedores Felices" subtitle="Lo que dicen quienes ya crecen con Wooly" />
        {[
          { text: "Siempre encuentro nuevos modelos para mis campañas. La variedad que tienen me ayuda a diferenciarme.", author: "Florería Gleemour — Tacna" },
          { text: "Compré para campaña y vendí todo en pocos días. Son productos de alta rotación.", author: "Detalles Rosé — Lima" },
        ].map((t, i) => (
          <div key={i} className="reveal bg-muted rounded-[25px] p-6 mb-4 border-l-[5px] border-secondary">
            <p className="italic text-[0.95rem] text-foreground mb-3 leading-relaxed">"{t.text}"</p>
            <span className="font-extrabold text-sm text-primary flex items-center gap-2">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" /> {t.author}
            </span>
          </div>
        ))}
      </section>

      {/* --- QUOTE --- */}
      <section className="max-w-[600px] mx-auto px-4 py-10 text-center">
        <Quote className="w-8 h-8 mx-auto text-secondary/40 mb-3" />
        <blockquote className="reveal text-lg text-foreground font-medium leading-relaxed">
          "La que compra por mayor, vende más...
          <span className="block text-secondary font-bold mt-1">Pero la que compra por caja, factura más."</span>
        </blockquote>
      </section>

      {/* --- SOCIAL --- */}
      <div className="flex justify-center gap-5 mb-10">
        {[
          { href: "https://www.tiktok.com/@woolyimports", icon: Sparkles, label: "TikTok" },
          { href: "https://www.instagram.com/woolyimports", icon: Heart, label: "Instagram" },
          { href: "https://www.facebook.com/woolyimports", icon: Users, label: "Facebook" },
          { href: "mailto:woolyimports@gmail.com", icon: Send, label: "Email" },
        ].map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
            className="w-[50px] h-[50px] rounded-[15px] bg-card shadow-sm flex items-center justify-center text-primary transition-all hover:-translate-y-1.5 hover:text-secondary">
            <s.icon className="w-5 h-5" />
          </a>
        ))}
      </div>

      {/* --- FOOTER --- */}
      <footer className="text-center py-12 border-t border-border/50">
        <p className="font-extrabold text-sm text-foreground uppercase tracking-wider">WOOLY IMPORT STORE</p>
        <p className="text-sm text-muted-foreground mt-1">Tacna — Perú</p>
        <p className="text-xs text-muted-foreground mt-1">Insumos para florerías, regalos y emprendimientos</p>
      </footer>

      {/* --- FLOATING BUTTONS --- */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-2.5 z-[999]">
        <Link
          to="/catalogo"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <ShoppingBag className="w-[18px] h-[18px]" />
          Ver catálogo
        </Link>
        <a
          href="https://wa.me/51936188636"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-whatsapp text-primary-foreground font-bold text-sm shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <MessageCircle className="w-[18px] h-[18px]" />
          Asesora
        </a>
      </div>

      {/* Global styles for this page */}
      <style>{`
        .reveal { opacity: 0; transform: translateY(15px); transition: all 0.5s ease-out; }
        .revealed { opacity: 1 !important; transform: translateY(0) !important; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes gradientFlow { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      `}</style>
    </div>
  );
}

/* ── Helpers ── */
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="reveal text-center mb-8">
      <h2 className="text-primary font-extrabold text-2xl mb-1">{title}</h2>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
    </div>
  );
}

function ProcessStep({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex-1 text-center">
      <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
      <b className="block text-xs uppercase tracking-wide text-foreground">{title}</b>
      <p className="text-[0.7rem] text-muted-foreground">{sub}</p>
    </div>
  );
}

function ShineOverlay() {
  return (
    <span className="absolute top-0 -left-3/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] animate-[shine_4s_infinite]" />
  );
}
