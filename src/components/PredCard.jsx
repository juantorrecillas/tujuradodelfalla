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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {picks.map((p) => (
            <span
              key={p}
              style={{
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: T.rPill,
                background: `${color}12`,
                color,
                fontWeight: 500
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
