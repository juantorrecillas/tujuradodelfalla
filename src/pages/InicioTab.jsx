import { T } from '../data/theme';
import { MODALIDADES, AGRUPACIONES, FECHAS_CLAVE, SESIONES_CUARTOS } from '../data/constants';
import { Section, Dot } from '../components/ui';
import { SessionCard } from '../components/SessionCard';

export function InicioTab({ setActive, onAdminClick }) {
  const today = new Date().toISOString().split('T')[0];
  const todaySession = SESIONES_CUARTOS.find(s => s.fecha === today);

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Hero */}
      <div
        className="hero-section"
        style={{
          background: `linear-gradient(160deg, #6B2C4A 0%, #4A1A30 100%)`,
          padding: "40px 24px 36px",
          color: T.textLight,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(200,155,94,.1)"
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(200,155,94,.05)"
          }}
        />
        <div className="fade-up hero-content" style={{ position: "relative", zIndex: 1 }}>
          <span className="hero-tag">
            COAC 2026
          </span>
          <h1 className="hero-title">
            Tu Jurado del Falla
            <br />
            <span className="hero-subtitle">Carnaval de Cádiz</span>
          </h1>
          <p className="hero-description">
            Sé jurado por un día. Mira quién canta, da puntos y apuesta por qué
            agrupaciones pasarán a la siguiente fase
          </p>
        </div>
        {/* Botón admin oculto */}
        <button
          onClick={onAdminClick}
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 24,
            height: 24,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            opacity: 0.1
          }}
          aria-label="Admin"
        />
      </div>

      <div className="page-content" style={{ padding: "24px 20px" }}>
        {/* Fases del concurso */}
        <Section title="Fases del concurso">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FECHAS_CLAVE.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 14 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 20,
                    flexShrink: 0
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 99,
                      marginTop: 4,
                      position: "relative",
                      zIndex: 1,
                      background: f.status === "active" ? T.primary : T.border,
                      border:
                        f.status === "active"
                          ? `3px solid ${T.primarySoft}`
                          : "none",
                      boxShadow:
                        f.status === "active"
                          ? `0 0 0 4px ${T.primary}20`
                          : "none"
                    }}
                  />
                  {i < FECHAS_CLAVE.length - 1 && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        background: T.border,
                        minHeight: 28
                      }}
                    />
                  )}
                </div>
                <div style={{ paddingBottom: 18 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: T.text,
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    {f.label}
                    {f.status === "active" && (
                      <span
                        className="pulse"
                        style={{
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: T.rPill,
                          background: T.accent,
                          color: "#fff",
                          fontWeight: 600
                        }}
                      >
                        EN CURSO
                      </span>
                    )}
                  </div>
                  <div
                    style={{ fontSize: 13, color: T.textSec, marginTop: 2 }}
                  >
                    {f.dates}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Hoy en el Falla */}
        {todaySession && (
          <Section title="Hoy en el Falla">
            <SessionCard session={todaySession} highlight />
          </Section>
        )}

        {/* CTAs */}
        <Section
          title="Participa"
          subtitle="Únete a la porra y compite con tus amigos"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => setActive("porra")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "18px",
                borderRadius: T.r,
                background: `linear-gradient(135deg, #6B2C4A, #4A1A30)`,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                boxShadow: T.shadowMd
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "rgba(255,255,255,.1)",
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
                  stroke={T.gold}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <div>
                <div
                  style={{ fontWeight: 700, fontSize: 14, color: T.textLight }}
                >
                  Hacer mi porra
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,.5)",
                    marginTop: 2
                  }}
                >
                  Predice quién pasa y con cuántos puntos
                </div>
              </div>
            </button>
            <button
              onClick={() => setActive("ranking")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "18px",
                borderRadius: T.r,
                background: `linear-gradient(135deg, #6B2C4A, #4A1A30)`,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                boxShadow: T.shadowMd
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: T.primarySoft,
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
                  stroke={T.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7" />
                  <path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7" />
                  <path d="M4 22h16" />
                  <path d="M18 2H6v7a6 6 0 0012 0V2z" />
                </svg>
              </div>
              <div>
                <div
                  style={{ fontWeight: 700, fontSize: 14, color: T.textLight }}
                >
                  Ver clasificación
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,.7)",
                    marginTop: 2
                  }}
                >
                  Ranking de aciertos entre participantes
                </div>
              </div>
            </button>
          </div>
        </Section>

        {/* Stats por modalidad */}
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10
          }}
        >
          {Object.entries(MODALIDADES).map(([key, m]) => (
            <div
              key={key}
              style={{
                background: T.bgCard,
                borderRadius: T.r,
                border: `1px solid ${T.border}`,
                padding: "16px",
                boxShadow: T.shadow
              }}
            >
              <Dot color={m.color} size={10} />
              <div
                style={{
                  fontFamily: T.fontDisplay,
                  fontSize: 26,
                  color: T.text,
                  marginTop: 8,
                  lineHeight: 1
                }}
              >
                {AGRUPACIONES[key].length}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: T.textSec,
                  marginTop: 4,
                  fontWeight: 500
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
