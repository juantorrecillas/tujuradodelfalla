import { T } from '../data/theme';

export function PredCard({ name, picks, max, color }) {
  return (
    <div
      style={{
        background: T.bgCard,
        borderRadius: T.r,
        border: `1px solid ${T.border}`,
        marginBottom: 10,
        overflow: "hidden",
        boxShadow: T.shadow
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          background: T.bgWarm,
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>
          {name}
        </span>
        <span style={{ fontSize: 12, color: T.textSec, fontWeight: 600 }}>
          {picks.length}/{max}
        </span>
      </div>
      <div style={{ padding: "10px 14px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {picks.map((p, i) => (
            <div
              key={p}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: 99,
                background: color, color: "#fff",
                fontWeight: 800, fontSize: 9,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0
              }}>
                {i + 1}°
              </span>
              <span
                style={{
                  fontSize: 12,
                  color,
                  fontWeight: 500
                }}
              >
                {p}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
