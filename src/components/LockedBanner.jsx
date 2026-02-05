import { T } from '../data/theme';

export function LockedBanner() {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, #D4756B, #B85A50)`,
        borderRadius: T.r,
        padding: "18px 20px",
        color: T.textLight,
        marginBottom: 20,
        boxShadow: T.shadowMd,
        display: "flex",
        alignItems: "center",
        gap: 14
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
          Predicciones bloqueadas
        </div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          El jurado ya ha fallado. Espera a la siguiente fase.
        </div>
      </div>
    </div>
  );
}
