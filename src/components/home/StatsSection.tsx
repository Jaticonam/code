import { useEffect, useRef, useState } from "react";
import { Boxes, Map, Truck, Users, BarChart3 } from "lucide-react";
import HomeSectionHeader from "./HomeSectionHeader";

function useCountUp(target: number, duration = 1600, start = false) {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;

    hasRun.current = true;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setValue(Math.floor(target * ease));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    }

    requestAnimationFrame(tick);
  }, [target, duration, start]);

  return value;
}

const stats = [
  {
    target: 1500,
    label: "emprendedores atendidos",
    icon: Users,
    gradient: "from-[#1d8299] to-[#4cb8c4]",
    ghost: "text-[#1d8299]/5 group-hover:text-[#1d8299]/10",
    iconBg: "bg-[#1d8299]/10",
    iconColor: "text-[#1d8299]",
    iconHover: "group-hover:bg-[#1d8299] group-hover:text-white",
  },
  {
    target: 800,
    label: "productos disponibles",
    icon: Boxes,
    gradient: "from-[#f391a0] to-[#f7b1d6]",
    ghost: "text-[#f391a0]/5 group-hover:text-[#f391a0]/10",
    iconBg: "bg-[#f7b1d6]/20",
    iconColor: "text-[#f286be]",
    iconHover: "group-hover:bg-[#f286be] group-hover:text-white",
  },
  {
    target: 39,
    label: "ciudades alcanzadas",
    icon: Map,
    gradient: "from-[#f9b233] to-[#fcd34d]",
    ghost: "text-[#f9b233]/5 group-hover:text-[#f9b233]/10",
    iconBg: "bg-[#f5b025]/10",
    iconColor: "text-[#f5b025]",
    iconHover: "group-hover:bg-[#f5b025] group-hover:text-white",
  },
  {
    target: 3800,
    label: "pedidos despachados",
    icon: Truck,
    gradient: "from-[#6a5a8a] to-[#a78bfa]",
    ghost: "text-[#6a5a8a]/5 group-hover:text-[#6a5a8a]/10",
    iconBg: "bg-[#6a5a8a]/10",
    iconColor: "text-[#6a5a8a]",
    iconHover: "group-hover:bg-[#6a5a8a] group-hover:text-white",
  },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="home-container pt-10 pb-12 md:pt-14 md:pb-16"
    >
      <HomeSectionHeader
        icon={BarChart3}
        kicker="movimiento real, clientes reales y pedidos que sí salen"
        title="resultados que respaldan tu compra"
        align="center"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
        {stats.map((item) => {
          const Icon = item.icon;
          const value = useCountUp(item.target, 1600, started);

          return (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-[30px] border border-slate-200/70 bg-white p-5 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:p-8"
            >
              {/* icono principal */}
              <div
                className={`relative z-10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${item.iconBg} ${item.iconColor} ${item.iconHover}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              {/* número */}
              <div
                className={`relative z-10 mb-2 bg-gradient-to-br ${item.gradient} bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl`}
              >
                +{value.toLocaleString("es-PE")}
              </div>

              {/* label */}
              <p className="relative z-10 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500 transition-colors group-hover:text-slate-950 md:text-sm">
                {item.label}
              </p>

              {/* icono decorativo */}
              <Icon
                className={`absolute -right-4 -bottom-4 z-0 h-24 w-24 transition-colors duration-300 md:h-28 md:w-28 ${item.ghost}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}