import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  BookOpen,
  FlaskConical,
  TrendingUp,
  Lightbulb,
  Briefcase,
  CalendarDays,
  ShoppingBag,
  GraduationCap,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const MENU = [
  { label: "Inicio", href: "/blog", icon: BookOpen },
  { label: "Laboratorio Ideas", href: "/blog/laboratorio", icon: FlaskConical },
  { label: "Tendencias", href: "/blog/tendencias", icon: TrendingUp },
  { label: "Oportunidades", href: "/blog/oportunidades", icon: Lightbulb },
  {
    label: "Herramientas",
    href: "/blog/herramientas",
    icon: Briefcase,
    children: [
      {
        label: "Calculadora margen",
        href: "/blog/herramientas/calculadora-margen",
      },
      { label: "Precio sugerido", href: "/blog/herramientas/precio-sugerido" },
      {
        label: "Checklist campaña",
        href: "/blog/herramientas/checklist-campana",
      },
      { label: "Kit inventario", href: "/blog/herramientas/kit-inventario" },
    ],
  },
  {
    label: "Campañas",
    href: "/blog/campanas",
    icon: CalendarDays,
    children: [
      { label: "San Valentín", href: "/blog/campanas/san-valentin" },
      { label: "Hot Wheels", href: "/blog/campanas/hot-wheels" },
      { label: "Día de la Madre", href: "/blog/campanas/dia-madre" },
    ],
  },
  { label: "Catálogo Wooly", href: "/blog/catalogo", icon: ShoppingBag },
  { label: "Guías y Estrategias", href: "/blog/guias", icon: GraduationCap },
];

export default function BlogSidebarMenu({
  mode = "all",
}: {
  mode?: "desktop" | "mobile" | "all";
}) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const renderMenu = () => (
    <nav className="blog-sidebar-menu">
      {MENU.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const expandedNow = expanded === item.href;

        return (
          <div key={item.href} className="blog-menu-group">
            <div className="blog-menu-row">
              <Link
                to={item.href}
                onClick={() => setOpen(false)}
                className={active ? "active" : ""}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>

              {item.children && (
                <button
                  type="button"
                  onClick={() => setExpanded(expandedNow ? null : item.href)}
                  className="blog-menu-expand"
                >
                  <ChevronDown
                    size={15}
                    className={expandedNow ? "open" : ""}
                  />
                </button>
              )}
            </div>

            {item.children && expandedNow && (
              <div className="blog-submenu">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    onClick={() => setOpen(false)}
                    className={pathname === child.href ? "active" : ""}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {mode !== "desktop" && (
        <>
          <button className="blog-mobile-header" onClick={() => setOpen(true)}>
            <span className="blog-mobile-header-icon">
              <Menu size={18} />
            </span>

            <div className="blog-mobile-header-text">
              <strong>Centro Wooly</strong>
              <small>Explorar recursos</small>
            </div>
          </button>

          <div
            className={
              open
                ? "blog-mobile-menu-overlay open"
                : "blog-mobile-menu-overlay"
            }
            onClick={() => setOpen(false)}
          />

          <aside
            className={
              open ? "blog-mobile-menu-panel open" : "blog-mobile-menu-panel"
            }
          >
            <div className="blog-mobile-menu-head">
              <strong>Centro Wooly</strong>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            {renderMenu()}
          </aside>
        </>
      )}

      {mode !== "mobile" && (
        <div className="blog-desktop-menu">{renderMenu()}</div>
      )}
    </>
  );
}
