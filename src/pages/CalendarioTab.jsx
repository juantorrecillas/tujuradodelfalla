import { useState } from 'react';
import { T } from '../data/theme';
import { SESIONES_SEMIFINALES } from '../data/constants';
import { PageHeader, Section } from '../components/ui';
import { SessionCard } from '../components/SessionCard';

export function CalendarioTab() {
  const [showAll, setShowAll] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const todaySession = SESIONES_SEMIFINALES.find(s => s.fecha === today);

  // Encontrar la próxima sesión
  const nextSession = SESIONES_SEMIFINALES.find(s => s.fecha > today);

  // Encontrar la última sesión pasada
  const pastSessions = SESIONES_SEMIFINALES.filter(s => s.fecha < today);
  const lastSession = pastSessions[pastSessions.length - 1];

  return (
    <div style={{ paddingBottom: 100 }}>
      <PageHeader
        title="Calendario"
        subtitle="Todas las sesiones de semifinales"
      />
      <div className="page-content" style={{ padding: "0 20px" }}>
        {todaySession ? (
          <Section
            title="Hoy en el Falla"
            subtitle={`${todaySession.dia} — Semifinales`}
          >
            <SessionCard session={todaySession} highlight />
          </Section>
        ) : (
          <Section title="Hoy en el Falla">
            <div
              style={{
                background: T.bgCard,
                borderRadius: T.r,
                padding: "20px",
                border: `1px solid ${T.border}`,
                boxShadow: T.shadow,
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  marginBottom: 12,
                  opacity: 0.3
                }}
              >
                🙍‍♂️🙍‍♀️
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: T.text,
                  marginBottom: 6
                }}
              >
                No hay sesión hoy
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: T.textSec,
                  lineHeight: 1.6
                }}
              >
                {nextSession ? (
                  <>
                    Próxima sesión: <strong style={{ color: T.text }}>{nextSession.dia}</strong>
                    <br />
                    <span style={{ fontSize: 12 }}>{nextSession.hora}</span>
                  </>
                ) : lastSession ? (
                  <>
                    Las semifinales han finalizado.
                    <br />
                    <span style={{ fontSize: 12 }}>Última sesión: {lastSession.dia}</span>
                  </>
                ) : (
                  "Consulta el calendario completo más abajo."
                )}
              </div>
            </div>
          </Section>
        )}

        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: T.rSm,
            border: `1.5px solid ${showAll ? T.wine : T.border}`,
            background: showAll ? `${T.wine}10` : T.bgCard,
            cursor: "pointer",
            fontFamily: T.font,
            fontWeight: 600,
            fontSize: 13,
            color: showAll ? T.wine : T.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: T.shadow
          }}
        >
          {showAll
            ? "Ocultar sesiones"
            : "Ver todas las sesiones de semifinales"}
          <span
            style={{
              display: "inline-block",
              transition: "transform .2s",
              transform: showAll ? "rotate(180deg)" : "none",
              fontSize: 10
            }}
          >
            ▼
          </span>
        </button>

        {showAll && (
          <div
            className="sessions-grid"
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}
          >
            {SESIONES_SEMIFINALES.map(s => (
              <SessionCard
                key={s.id}
                session={s}
                highlight={s.fecha === today}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
