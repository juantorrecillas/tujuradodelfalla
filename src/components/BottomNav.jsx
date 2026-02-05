import { T } from '../data/theme';

const navIcon = (id, active) => {
  const c = active ? T.primary : T.textSec;
  const p = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch (id) {
    case "inicio":
      return (
        <svg {...p}>
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "calendario":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "porra":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case "ranking":
      return (
        <svg {...p}>
          <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7" />
          <path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7" />
          <path d="M4 22h16" />
          <path d="M18 2H6v7a6 6 0 0012 0V2z" />
        </svg>
      );
    default:
      return null;
  }
};

const labels = {
  inicio: "Inicio",
  calendario: "Calendario",
  porra: "Porra",
  ranking: "Ranking"
};

export function BottomNav({ active, setActive }) {
  return (
    <nav
      className="bottom-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(255,255,255,.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${T.border}`,
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom, 6px)"
      }}
    >
      {/* Logo - solo visible en desktop */}
      <div className="nav-logo" style={{ display: "none" }}>
        <div style={{
          fontFamily: T.fontDisplay,
          fontSize: 18,
          color: T.wine,
          fontWeight: 700,
          marginBottom: 4
        }}>
          El Juez del Falla
        </div>
        <div style={{
          fontSize: 11,
          color: T.textSec,
          letterSpacing: 1,
          textTransform: "uppercase"
        }}>
          COAC 2026
        </div>
      </div>

      {["inicio", "calendario", "porra", "ranking"].map((id) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          className="nav-button"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            padding: "10px 4px 7px",
            border: "none",
            cursor: "pointer",
            background: active === id ? "rgba(200, 155, 94, 0.1)" : "transparent",
            fontFamily: T.font,
            fontSize: 10,
            fontWeight: active === id ? 700 : 500,
            color: active === id ? T.primary : T.textSec,
            borderRadius: 0,
            transition: "background 0.2s"
          }}
        >
          {navIcon(id, active === id)}
          <span className="nav-label">{labels[id]}</span>
        </button>
      ))}
    </nav>
  );
}
