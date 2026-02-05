import { useState, useEffect } from 'react';
import { T } from '../data/theme';
import { MODALIDADES, AGRUPACIONES, SCORING } from '../data/constants';
import { Section, Dot, Tag } from '../components/ui';
import { PredCard } from '../components/PredCard';
import { LockedBanner } from '../components/LockedBanner';
import { usePredictions, useScores } from '../hooks/useAppState';

// ============================================
// LOGIN FORM
// ============================================
function LoginForm({ onLogin }) {
  const [nameInput, setNameInput] = useState("");

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
              border: `1.5px solid ${T.border}`,
              background: T.bgWarm,
              fontFamily: T.font,
              fontSize: 15,
              color: T.text,
              outline: "none"
            }}
            onFocus={e => (e.target.style.borderColor = T.primary)}
            onBlur={e => (e.target.style.borderColor = T.border)}
          />
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

  const { allPredictions, myPredictions, togglePrediction } = usePredictions(userName);

  const mod = MODALIDADES[activeMod];
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

      {/* Contador */}
      <div
        style={{
          borderRadius: T.rSm,
          padding: "10px 14px",
          marginBottom: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background:
            myPicks.length === mod.maxPasan ? `${mod.color}10` : T.bgWarm,
          border: `1px solid ${
            myPicks.length === mod.maxPasan ? mod.color + "30" : T.border
          }`
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
          {myPicks.length} de {mod.maxPasan}
        </span>
        {myPicks.length === mod.maxPasan && (
          <span style={{ fontSize: 12, color: mod.color, fontWeight: 700 }}>
            Completo
          </span>
        )}
      </div>

      {/* Lista de agrupaciones */}
      <div className="agrupaciones-grid" style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {agrs.map(nombre => {
          const sel = myPicks.includes(nombre);
          return (
            <button
              key={nombre}
              onClick={() => !locked && togglePrediction(activeMod, nombre, mod.maxPasan)}
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
                  justifyContent: "center"
                }}
              >
                {sel && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
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
              max={mod.maxPasan}
              color={mod.color}
            />
            {others.map(p => {
              const picks = p.predictions[activeMod] || [];
              return picks.length > 0 ? (
                <PredCard
                  key={p.name}
                  name={p.name}
                  picks={picks}
                  max={mod.maxPasan}
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
  const [activeMod, setActiveMod] = useState("comparsas");
  const [selectedAgr, setSelectedAgr] = useState(null);

  const { myScores, setScore } = useScores(userName);

  const mod = MODALIDADES[activeMod];
  const agrs = AGRUPACIONES[activeMod];
  const scoreDef = SCORING[activeMod];
  const maxTotal = scoreDef.reduce((s, d) => s + d.max, 0);

  const getTotal = agr => {
    const s = myScores[activeMod]?.[agr] || {};
    return scoreDef.reduce((sum, d) => sum + (s[d.key] || 0), 0);
  };

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
            <div style={{ padding: "8px 16px" }}>
              {scoreDef.map((s, i) => {
                const val = myScores[activeMod]?.[selectedAgr]?.[s.key] ?? "";
                return (
                  <div
                    key={s.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom:
                        i < scoreDef.length - 1
                          ? `1px solid ${T.border}40`
                          : "none"
                    }}
                  >
                    <div>
                      <div
                        style={{ fontSize: 13, fontWeight: 500, color: T.text }}
                      >
                        {s.label}
                      </div>
                      <div style={{ fontSize: 11, color: T.textSec }}>
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
                        !locked && setScore(activeMod, selectedAgr, s.key, e.target.value, s.max)
                      }
                      disabled={locked}
                      placeholder="—"
                      style={{
                        width: 60,
                        padding: "8px",
                        borderRadius: 8,
                        textAlign: "center",
                        border: `1.5px solid ${
                          val !== "" ? mod.color + "40" : T.border
                        }`,
                        background:
                          val !== "" ? `${mod.color}06` : T.bgWarm,
                        fontFamily: T.font,
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.text,
                        outline: "none",
                        opacity: locked ? 0.7 : 1
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

  if (!userName) {
    return <LoginForm onLogin={onLogin} />;
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
