import type {
  ReactNode,
} from "react";

import "./AdminShell.css";

interface AdminShellProps {
  children:
    ReactNode;
}

const futureItems = [
  "Productos",
  "Campañas",
  "Clientes",
  "Historial",
] as const;

export default function AdminShell({
  children,
}: AdminShellProps) {
  return (
    <div className="wooly-admin-shell">
      <aside className="wooly-admin-shell__sidebar">
        <div className="wooly-admin-shell__brand">
          <strong>
            W
          </strong>

          <span>
            Wooly
          </span>
        </div>

        <nav
          className="wooly-admin-shell__navigation"
          aria-label="Wooly Admin"
        >
          <a
            href="/admin"
            className="is-active"
            aria-current="page"
          >
            <span className="wooly-admin-shell__navIcon">
              ▣
            </span>

            <span>
              Catálogos
            </span>
          </a>

          {futureItems.map(
            (item) => (
              <button
                key={item}
                type="button"
                disabled
                title="Próximamente"
              >
                <span className="wooly-admin-shell__navIcon">
                  ·
                </span>

                <span>
                  {item}
                </span>
              </button>
            ),
          )}
        </nav>

        <div className="wooly-admin-shell__sidebarFooter">
          <button
            type="button"
            disabled
            title="Próximamente"
          >
            <span className="wooly-admin-shell__navIcon">
              ⚙
            </span>

            <span>
              Sistema
            </span>
          </button>
        </div>
      </aside>

      <div className="wooly-admin-shell__stage">
        <header className="wooly-admin-shell__topbar">
          <div className="wooly-admin-shell__context">
            <span>
              WOOLY ADMIN 1.0
            </span>

            <div>
              <strong>
                Catálogos
              </strong>

              <small>
                Workspace de ventas
              </small>
            </div>
          </div>

          <div className="wooly-admin-shell__actions">
            <a
              href="/catalogo"
              target="_blank"
              rel="noreferrer"
            >
              Ver catálogo
            </a>
          </div>
        </header>

        <div className="wooly-admin-shell__workspace">
          {children}
        </div>
      </div>
    </div>
  );
}