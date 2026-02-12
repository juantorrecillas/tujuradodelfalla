import { useState } from 'react';
import { T } from '../data/theme';
import { SESIONES_FINAL, AGRUPACIONES, MODALIDADES } from '../data/constants';
import { PageHeader, Section } from '../components/ui';
import { SessionCard } from '../components/SessionCard';
import { Dot } from '../components/ui';

export function CalendarioTab() {
  const [showAll, setShowAll] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const hasSessions = SESIONES_FINAL.length > 0;
  const todaySession = hasSessions ? SESIONES_FINAL.find(s => s.fecha === today) : null;
  const nextSession = hasSessions ? SESIONES_FINAL.find(s => s.fecha > today) : null;
  const pastSessions = hasSessions ? SESIONES_FINAL.filter(s => s.fecha < today) : [];
  const lastSession = pastSessions[pastSessions.length - 1];

  return (
    <div style={{ paddingBottom: 100 }}>
      <PageHeader
        title="Calendario"
        subtitle="Gran Final del COAC 2026"
      />
      <div className="page-content" style={{ padding: "0 20px" }}>
        {todaySession ? (
          <Section
            title="Hoy en el Falla"
            subtitle={`${todaySession.dia} — Gran Final`}
          >
            <SessionCard session={todaySession} highlight />
          </Section>
        ) : (
          <Section title="Gran Final">
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
                🏆
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: T.text,
                  marginBottom: 6
                }}
              >
                {!hasSessions ? "Calendario por determinar" : "No hay sesión hoy"}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: T.textSec,
                  lineHeight: 1.6
                }}
              >
                {!hasSessions ? (
                  "El calendario de la Gran Final se publicará próximamente."
                ) : nextSession ? (
                  <>
                    Próxima sesión: <strong style={{ color: T.text }}>{nextSession.dia}</strong>
                    <br />
                    <span style={{ fontSize: 12 }}>{nextSession.hora}</span>
                  </>
                ) : lastSession ? (
                  <>
                    La Gran Final ha finalizado.
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

        {/* Finalistas */}
        <Section title="Finalistas" subtitle="Agrupaciones clasificadas para la Gran Final">
          {Object.entries(MODALIDADES).map(([key, mod]) => (
            <div
              key={key}
              style={{
                background: T.bgCard,
                borderRadius: T.rSm,
                border: `1px solid ${T.border}`,
                padding: "14px 16px",
                marginBottom: 8,
                boxShadow: T.shadow
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Dot color={mod.color} size={10} />
                <span style={{ fontWeight: 700, fontSize: 13, color: mod.color }}>
                  {mod.label}s
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {AGRUPACIONES[key].map(nombre => (
                  <span
                    key={nombre}
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 99,
                      background: `${mod.color}12`,
                      color: mod.color,
                      fontWeight: 500
                    }}
                  >
                    {nombre}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Section>

        {hasSessions && (
          <>
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
                : "Ver todas las sesiones de la final"}
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
                {SESIONES_FINAL.map(s => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    highlight={s.fecha === today}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
