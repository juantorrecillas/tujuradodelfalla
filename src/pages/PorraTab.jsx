import { useState, useEffect } from 'react';
import { T } from '../data/theme';
import { MODALIDADES, AGRUPACIONES, AGRUPACIONES_SEMIFINALES, SCORING, MAX_PASAN } from '../data/constants';
import { Section, Dot, Tag } from '../components/ui';
import { PredCard } from '../components/PredCard';
import { LockedBanner } from '../components/LockedBanner';
import { usePredictions, useScores } from '../hooks/useAppState';
import { fsSubscribe } from '../lib/firebase';

// ============================================
// LOGIN FORM
// ============================================
function LoginForm({ onLogin, allPredictions }) {
  const [nameInput, setNameInput] = useState("");

  const nameExists = nameInput.trim() && allPredictions[nameInput.trim()];

  const handleSubmit = () => {
    if (nameInput.trim()) {
      onLogin(nameInput.trim());
    }
  };

  return (
    <div className="page-content" style={{ padding: "24px 20px 100px" }}>
      <Section
        title="Únete a la porra"
        subtitle="Introduce tu nombre para guardar tus predicciones. Si ya participaste, usa el mismo nombre para editar lo que tenías."
      >
        <div
          style={{
            background: T.bgCard,
            borderRadius: T.r,
            padding: 22,
            border: `1px solid ${T.border}`,
            boxShadow: T.shadowMd
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 600,
              color: T.textSec,
              marginBottom: 8,
              letterSpacing: 0.5,
              textTransform: "uppercase"
            }}
          >
            Tu nombre
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Ej: Juan, María..."
            autoFocus
            style={{
              width: "100%",
              padding: "13px 16px",
              borderRadius: T.rSm,
              border: `1.5px solid ${nameExists ? "#F5A623" : T.border}`,
              background: T.bgWarm,
              fontFamily: T.font,
              fontSize: 15,
              color: T.text,
              outline: "none"
            }}
            onFocus={e => (e.target.style.borderColor = nameExists ? "#F5A623" : T.primary)}
            onBlur={e => (e.target.style.borderColor = nameExists ? "#F5A623" : T.border)}
          />

          {nameExists && (
            <div
              style={{
                marginTop: 12,
                padding: "12px 14px",
                borderRadius: T.rSm,
                background: "#FFF3CD",
                border: "1px solid #F5A623",
                display: "flex",
                alignItems: "start",
                gap: 10
              }}
            >
              <span style={{ fontSize: 16 }}>⚠️</span>
              <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5, color: "#856404" }}>
                <strong>Este nombre ya está en uso.</strong> Si eres tú, puedes continuar y editar tus predicciones. Si no, por favor usa otro nombre para diferenciaros.
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!nameInput.trim()}
            style={{
              width: "100%",
              marginTop: 14,
              padding: "13px",
              borderRadius: T.rSm,
              border: "none",
              cursor: nameInput.trim() ? "pointer" : "default",
              fontFamily: T.font,
              fontWeight: 700,
              fontSize: 14,
              background: nameInput.trim() ? "#6B2C4A" : T.border,
              color: nameInput.trim() ? T.textLight : T.textSec
            }}
          >
            Entrar
          </button>
        </div>
      </Section>
    </div>
  );
}

// ============================================
// QUIEN PASA VIEW
// ============================================
function QuienPasaView({ userName, locked }) {
  const [activeMod, setActiveMod] = useState("comparsas");
  const [showOthers, setShowOthers] = useState(false);

  const { allPredictions, myPredictions, togglePrediction } = usePredictions(userName, 'final');

  const mod = MODALIDADES[activeMod];
  const maxPasan = MAX_PASAN.final[activeMod];
  const agrs = AGRUPACIONES[activeMod];
  const myPicks = myPredictions[activeMod] || [];

  const others = Object.entries(allPredictions)
    .filter(([n]) => n !== userName)
    .map(([n, d]) => ({ name: n, predictions: d }));

  return (
    <>
      {locked && <LockedBanner />}

      {/* Selector de modalidad */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 18,
          overflowX: "auto",
          paddingBottom: 4
        }}
      >
        {Object.entries(MODALIDADES).map(([key, m]) => (
          <button
            key={key}
            onClick={() => setActiveMod(key)}
            style={{
              padding: "7px 14px",
              borderRadius: T.rPill,
              border: "none",
              cursor: "pointer",
              fontFamily: T.font,
              fontWeight: 600,
              fontSize: 12,
              whiteSpace: "nowrap",
              background: activeMod === key ? m.color : T.bgCard,
              color: activeMod === key ? "#fff" : T.text,
              boxShadow:
                activeMod === key ? `0 2px 8px ${m.color}35` : T.shadow
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Podio */}
      <div
        style={{
          borderRadius: T.rSm,
          padding: "12px 14px",
          marginBottom: 14,
          background: T.bgWarm,
          border: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 6
        }}
      >
        {["Primer premio", "Segundo premio", "Tercer premio"].map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 24, height: 24, borderRadius: 99,
              background: myPicks[i] ? mod.color : T.border,
              color: "#fff", fontWeight: 800, fontSize: 11,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              {i + 1}°
            </span>
            <span style={{
              fontSize: 13,
              fontWeight: myPicks[i] ? 600 : 400,
              color: myPicks[i] ? T.text : T.textSec,
              fontStyle: myPicks[i] ? "normal" : "italic"
            }}>
              {myPicks[i] || label}
            </span>
          </div>
        ))}
      </div>

      {/* Lista de agrupaciones */}
      <div className="agrupaciones-grid" style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {agrs.map(nombre => {
          const pos = myPicks.indexOf(nombre);
          const sel = pos !== -1;
          return (
            <button
              key={nombre}
              onClick={() => !locked && togglePrediction(activeMod, nombre, maxPasan)}
              disabled={locked}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: T.rSm,
                border: sel
                  ? `1.5px solid ${mod.color}`
                  : `1px solid ${T.border}`,
                background: sel ? `${mod.color}08` : T.bgCard,
                cursor: locked ? "not-allowed" : "pointer",
                textAlign: "left",
                fontFamily: T.font,
                opacity: locked ? 0.7 : 1
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  flexShrink: 0,
                  border: sel ? "none" : `2px solid ${T.border}`,
                  background: sel ? mod.color : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 10
                }}
              >
                {sel && `${pos + 1}°`}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: sel ? 600 : 400,
                  color: sel ? T.text : T.textSec
                }}
              >
                {nombre}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ver predicciones de otros */}
      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => setShowOthers(!showOthers)}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: T.rSm,
            border: `1.5px solid ${showOthers ? "#6B2C4A" : T.border}`,
            background: showOthers ? "#6B2C4A" : T.bgCard,
            cursor: "pointer",
            fontFamily: T.font,
            fontWeight: 600,
            fontSize: 13,
            color: showOthers ? T.textLight : T.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: T.shadow
          }}
        >
          {showOthers ? "Ocultar predicciones" : "Ver predicciones de todos"}
        </button>
        {showOthers && (
          <div style={{ marginTop: 14 }}>
            <PredCard
              name={`${userName} (tú)`}
              picks={myPicks}
              max={maxPasan}
              color={mod.color}
            />
            {others.map(p => {
              const picks = p.predictions[activeMod] || [];
              return picks.length > 0 ? (
                <PredCard
                  key={p.name}
                  name={p.name}
                  picks={picks}
                  max={maxPasan}
                  color={mod.color}
                />
              ) : null;
            })}
            {others.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: 24,
                  color: T.textSec,
                  fontSize: 13,
                  lineHeight: 1.6
                }}
              >
                Nadie más ha hecho su porra todavía. Comparte el enlace con tus
                amigos.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ============================================
// PUNTOS VIEW
// ============================================
function PuntosView({ userName, locked }) {
  const [activeFase, setActiveFase] = useState("final");
  const [activeMod, setActiveMod] = useState("comparsas");
  const [selectedAgr, setSelectedAgr] = useState(null);
  const [showSemiScores, setShowSemiScores] = useState(false);

  const { allScores, myScores, setScore } = useScores(userName, activeFase);

  const isReadOnly = activeFase !== "final";
  const mod = MODALIDADES[activeMod];
  const agrs = activeFase === "semifinales" ? AGRUPACIONES_SEMIFINALES[activeMod] : AGRUPACIONES[activeMod];
  const scoreDef = SCORING[activeMod];
  const maxTotal = scoreDef.reduce((s, d) => s + d.max, 0);
  const inputDisabled = locked || isReadOnly;

  const getTotal = agr => {
    const s = myScores[activeMod]?.[agr] || {};
    return scoreDef.reduce((sum, d) => sum + (s[d.key] || 0), 0);
  };

  return (
    <>
      {locked && !isReadOnly && <LockedBanner />}

      {/* Selector de fase */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 16,
          background: T.bgWarm,
          borderRadius: T.rSm,
          padding: 4,
          border: `1px solid ${T.border}`
        }}
      >
        {[
          { id: "final", label: "Final" },
          { id: "semifinales", label: "Semifinales" }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => {
              setActiveFase(f.id);
              setSelectedAgr(null);
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: T.font,
              fontWeight: 600,
              fontSize: 13,
              background: activeFase === f.id ? T.bgCard : "transparent",
              color: activeFase === f.id ? T.text : T.textSec,
              boxShadow: activeFase === f.id ? T.shadow : "none"
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isReadOnly && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: T.rSm,
            background: `${T.wine}08`,
            border: `1px solid ${T.wine}20`,
            marginBottom: 14,
            fontSize: 12,
            color: T.wine,
            fontWeight: 500
          }}
        >
          Puntuaciones de semifinales (solo lectura)
        </div>
      )}

      {/* Selector de modalidad */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 18,
          overflowX: "auto",
          paddingBottom: 4
        }}
      >
        {Object.entries(MODALIDADES).map(([key, m]) => (
          <button
            key={key}
            onClick={() => {
              setActiveMod(key);
              setSelectedAgr(null);
            }}
            style={{
              padding: "7px 14px",
              borderRadius: T.rPill,
              border: "none",
              cursor: "pointer",
              fontFamily: T.font,
              fontWeight: 600,
              fontSize: 12,
              whiteSpace: "nowrap",
              background: activeMod === key ? m.color : T.bgCard,
              color: activeMod === key ? "#fff" : T.text,
              boxShadow:
                activeMod === key ? `0 2px 8px ${m.color}35` : T.shadow
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {!selectedAgr ? (
        // Lista de agrupaciones
        <div className="agrupaciones-grid" style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {agrs.map(nombre => {
            const total = getTotal(nombre);
            const filled = total > 0;
            return (
              <button
                key={nombre}
                onClick={() => setSelectedAgr(nombre)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "13px 14px",
                  borderRadius: T.rSm,
                  border: `1px solid ${filled ? mod.color + "30" : T.border}`,
                  background: filled ? `${mod.color}05` : T.bgCard,
                  cursor: "pointer",
                  fontFamily: T.font,
                  textAlign: "left",
                  boxShadow: T.shadow
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {filled && <Dot color={mod.color} size={6} />}
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: filled ? 600 : 400,
                      color: T.text
                    }}
                  >
                    {nombre}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {filled && (
                    <span
                      style={{ fontSize: 13, fontWeight: 700, color: mod.color }}
                    >
                      {total}
                    </span>
                  )}
                  <span style={{ color: T.textSec, fontSize: 16 }}>›</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        // Detalle de puntuación
        <div>
          <button
            onClick={() => setSelectedAgr(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: T.font,
              fontSize: 13,
              color: mod.color,
              fontWeight: 600,
              marginBottom: 14,
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            ← Volver
          </button>
          <div
            style={{
              background: T.bgCard,
              borderRadius: T.r,
              border: `1px solid ${T.border}`,
              overflow: "hidden",
              boxShadow: T.shadowMd
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                background: `${mod.color}08`,
                borderBottom: `1px solid ${T.border}`
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>
                {selectedAgr}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 6
                }}
              >
                <Tag color={mod.color}>{mod.label}</Tag>
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: mod.color }}
                >
                  {getTotal(selectedAgr)} / {maxTotal}
                </span>
              </div>
            </div>
            <div style={{
              padding: "10px 16px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "8px"
            }}>
              {scoreDef.map((s) => {
                const val = myScores[activeMod]?.[selectedAgr]?.[s.key] ?? "";
                return (
                  <div
                    key={s.key}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "10px",
                      background: T.bgWarm,
                      borderRadius: 8,
                      gap: 8
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{ fontSize: 12, fontWeight: 500, color: T.text, marginBottom: 2 }}
                      >
                        {s.label}
                      </div>
                      <div style={{ fontSize: 10, color: T.textSec }}>
                        máx. {s.max}
                      </div>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={s.max}
                      step={0.1}
                      value={val}
                      onChange={e =>
                        !inputDisabled && setScore(activeMod, selectedAgr, s.key, e.target.value, s.max)
                      }
                      disabled={inputDisabled}
                      placeholder="—"
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: 8,
                        textAlign: "center",
                        border: `1.5px solid ${
                          val !== "" ? mod.color + "40" : T.border
                        }`,
                        background:
                          val !== "" ? `${mod.color}06` : "#fff",
                        fontFamily: T.font,
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.text,
                        outline: "none",
                        opacity: inputDisabled ? 0.7 : 1
                      }}
                      onFocus={e => (e.target.style.borderColor = mod.color)}
                      onBlur={e =>
                        (e.target.style.borderColor =
                          val !== "" ? mod.color + "40" : T.border)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Puntuaciones de semifinales de todos */}
          {activeFase === "final" && (() => {
            const semiUsers = Object.entries(allScores)
              .map(([name, data]) => {
                const scores = data?.semifinales?.[activeMod]?.[selectedAgr];
                if (!scores) return null;
                const total = scoreDef.reduce((sum, d) => sum + (scores[d.key] || 0), 0);
                if (total === 0) return null;
                return { name, scores, total };
              })
              .filter(Boolean)
              .sort((a, b) => b.total - a.total);

            if (semiUsers.length === 0) return null;

            return (
              <div style={{ marginTop: 14 }}>
                <button
                  onClick={() => setShowSemiScores(!showSemiScores)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: T.rSm,
                    border: `1.5px solid ${showSemiScores ? T.wine : T.border}`,
                    background: showSemiScores ? `${T.wine}08` : T.bgCard,
                    cursor: "pointer",
                    fontFamily: T.font,
                    fontWeight: 600,
                    fontSize: 13,
                    color: showSemiScores ? T.wine : T.text,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: T.shadow
                  }}
                >
                  {showSemiScores ? "Ocultar" : "Ver puntuaciones de semifinales"}
                  <span style={{
                    display: "inline-block",
                    transition: "transform .2s",
                    transform: showSemiScores ? "rotate(180deg)" : "none",
                    fontSize: 10
                  }}>▼</span>
                </button>

                {showSemiScores && (
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    {semiUsers.map(u => (
                      <div
                        key={u.name}
                        style={{
                          background: T.bgCard,
                          borderRadius: T.rSm,
                          border: `1px solid ${T.border}`,
                          overflow: "hidden",
                          boxShadow: T.shadow
                        }}
                      >
                        <div style={{
                          padding: "10px 14px",
                          background: T.bgWarm,
                          borderBottom: `1px solid ${T.border}`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>
                            {u.name}{u.name === userName ? " (tú)" : ""}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: mod.color }}>
                            {u.total} / {maxTotal}
                          </span>
                        </div>
                        <div style={{
                          padding: "8px 14px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6
                        }}>
                          {scoreDef.map(s => {
                            const val = u.scores[s.key];
                            if (val == null) return null;
                            return (
                              <span key={s.key} style={{
                                fontSize: 11,
                                padding: "3px 8px",
                                borderRadius: T.rPill,
                                background: `${mod.color}10`,
                                color: mod.color,
                                fontWeight: 500
                              }}>
                                {s.label}: {val}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
}

// ============================================
// MAIN PORRA TAB
// ============================================
export function PorraTab({ userName, onLogin, onLogout, locked }) {
  const [subTab, setSubTab] = useState("pasa");
  const [allPredictions, setAllPredictions] = useState({});

  // Suscribirse a todas las predicciones para verificar nombres duplicados
  useEffect(() => {
    const unsubscribe = fsSubscribe('predictions', 'all', (data) => {
      setAllPredictions(data || {});
    });
    return () => unsubscribe();
  }, []);

  if (!userName) {
    return <LoginForm onLogin={onLogin} allPredictions={allPredictions} />;
  }

  return (
    <div className="page-content" style={{ padding: "24px 20px 100px" }}>
      {/* Header con usuario */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}
      >
        <div>
          <span
            style={{ fontSize: 12, color: T.textSec, fontWeight: 500 }}
          >
            Jugando como
          </span>
          <div style={{ fontWeight: 700, fontSize: 16, color: T.text }}>
            {userName}
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: "6px 14px",
            borderRadius: T.rPill,
            border: `1px solid ${T.border}`,
            background: T.bgCard,
            fontSize: 12,
            fontWeight: 600,
            color: T.textSec,
            cursor: "pointer",
            fontFamily: T.font
          }}
        >
          Cambiar
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 24,
          background: T.bgWarm,
          borderRadius: T.rSm,
          padding: 4,
          border: `1px solid ${T.border}`
        }}
      >
        {[
          { id: "pasa", label: "¿Quién pasa?" },
          { id: "puntos", label: "Puntuación" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: T.font,
              fontWeight: 600,
              fontSize: 13,
              background: subTab === t.id ? T.bgCard : "transparent",
              color: subTab === t.id ? T.text : T.textSec,
              boxShadow: subTab === t.id ? T.shadow : "none"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "pasa" ? (
        <QuienPasaView userName={userName} locked={locked} />
      ) : (
        <PuntosView userName={userName} locked={locked} />
      )}
    </div>
  );
}
