import { T } from '../data/theme';
import { MODALIDADES } from '../data/constants';
import { Dot, Tag } from './ui';

export function SessionCard({ session, highlight }) {
  return (
    <div
      className="fade-up"
      style={{
        background: T.bgCard,
        borderRadius: T.r,
        overflow: "hidden",
        border: highlight
          ? `1.5px solid ${T.primary}`
          : `1px solid ${T.border}`,
        boxShadow: highlight ? T.shadowMd : T.shadow
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: highlight ? T.primarySoft : T.bgWarm
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>
            {session.label}
          </div>
          <div style={{ fontSize: 12, color: T.textSec }}>{session.dia}</div>
        </div>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: T.rSm,
            background: highlight ? "#6B2C4A" : T.textSec,
            color: T.textLight,
            fontSize: 12,
            fontWeight: 700
          }}
        >
          {session.hora}
        </span>
      </div>
      <div style={{ padding: "6px 16px" }}>
        {session.agrupaciones.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 0",
              borderBottom:
                i < session.agrupaciones.length - 1
                  ? `1px solid ${T.border}40`
                  : "none"
            }}
          >
            <Dot color={MODALIDADES[a.modalidad].color} />
            <span
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: 500,
                color: T.text
              }}
            >
              {a.nombre}
            </span>
            <Tag color={MODALIDADES[a.modalidad].color}>
              {MODALIDADES[a.modalidad].label}
            </Tag>
          </div>
        ))}
      </div>
    </div>
  );
}
