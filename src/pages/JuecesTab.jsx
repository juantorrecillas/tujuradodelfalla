import { useState, useEffect } from 'react';
import { T } from '../data/theme';
import { MODALIDADES, AGRUPACIONES, SCORING } from '../data/constants';
import { Section, Tag, Dot } from '../components/ui';
import { fsSubscribe } from '../lib/firebase';

// ============================================
// POR JUEZ VIEW
// ============================================
function PorJuezView({ allScores, jueces }) {
  const [activeMod, setActiveMod] = useState("comparsas");
  const [selectedJuez, setSelectedJuez] = useState(null);
  const [expandedAgrupacion, setExpandedAgrupacion] = useState(null);

  const mod = MODALIDADES[activeMod];
  const agrs = AGRUPACIONES[activeMod];
  const scoreDef = SCORING[activeMod];
  const maxTotal = scoreDef.reduce((s, d) => s + d.max, 0);

  // Obtener el total de puntos que un juez ha dado a una agrupación
  const getJuezTotal = (juezName, modalidad, agrupacion) => {
    const juezScores = allScores[juezName];
    if (!juezScores || !juezScores[modalidad] || !juezScores[modalidad][agrupacion]) {
      return null;
    }

    const scores = juezScores[modalidad][agrupacion];
    return scoreDef.reduce((sum, d) => sum + (scores[d.key] || 0), 0);
  };

  // Obtener todas las agrupaciones puntuadas por un juez
  const getAgrupacionesPuntuadas = (juezName, modalidad) => {
    return agrs
      .map(nombre => {
        const total = getJuezTotal(juezName, modalidad, nombre);
        return { nombre, total };
      })
      .filter(a => a.total !== null)
      .sort((a, b) => b.total - a.total);
  };

  // Contar cuántas agrupaciones ha puntuado cada juez en esta modalidad
  const getCountPuntuaciones = (juezName, modalidad) => {
    return agrs.filter(agr => getJuezTotal(juezName, modalidad, agr) !== null).length;
  };

  return (
    <>
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
              setSelectedJuez(null);
              setExpandedAgrupacion(null);
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

      {!selectedJuez ? (
        // Lista de jueces
        <>
          <div
            style={{
              background: `${mod.color}10`,
              borderRadius: T.r,
              padding: "14px 16px",
              marginBottom: 14,
              border: `1px solid ${mod.color}30`
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: T.textSec, marginBottom: 4 }}>
              Predicciones por Juez
            </div>
            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>
              Selecciona un juez para ver todas sus predicciones de {mod.label}.
            </div>
          </div>

          <div className="jueces-grid" style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {jueces.map(juezName => {
              const count = getCountPuntuaciones(juezName, activeMod);
              if (count === 0) return null;

              return (
                <button
                  key={juezName}
                  onClick={() => setSelectedJuez(juezName)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 14px",
                    borderRadius: T.rSm,
                    border: `1px solid ${T.border}`,
                    background: T.bgCard,
                    cursor: "pointer",
                    fontFamily: T.font,
                    textAlign: "left",
                    boxShadow: T.shadow
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: `${mod.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                        color: mod.color,
                        flexShrink: 0
                      }}
                    >
                      {juezName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: T.text
                        }}
                      >
                        {juezName}
                      </div>
                      <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>
                        {count} {count === 1 ? 'predicción' : 'predicciones'}
                      </div>
                    </div>
                  </div>
                  <span style={{ color: T.textSec, fontSize: 16 }}>›</span>
                </button>
              );
            })}
          </div>

          {jueces.filter(j => getCountPuntuaciones(j, activeMod) > 0).length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 24,
                color: T.textSec,
                fontSize: 13,
                lineHeight: 1.6
              }}
            >
              Aún no hay predicciones para esta modalidad.
            </div>
          )}
        </>
      ) : (
        // Detalle de un juez
        <div>
          <button
            onClick={() => {
              setSelectedJuez(null);
              setExpandedAgrupacion(null);
            }}
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

          {/* Cabecera del juez */}
          <div
            style={{
              background: `${mod.color}10`,
              borderRadius: T.r,
              padding: "16px 18px",
              marginBottom: 14,
              border: `1px solid ${mod.color}30`,
              display: "flex",
              alignItems: "center",
              gap: 12
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: mod.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 18,
                color: "#fff",
                flexShrink: 0
              }}
            >
              {selectedJuez.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 4 }}>
                {selectedJuez}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Tag color={mod.color}>{mod.label}</Tag>
                <div style={{ fontSize: 12, color: T.textSec }}>
                  {getAgrupacionesPuntuadas(selectedJuez, activeMod).length} predicciones
                </div>
              </div>
            </div>
          </div>

          {/* Lista de predicciones - ACORDEONES DESPLEGABLES */}
          {getAgrupacionesPuntuadas(selectedJuez, activeMod).map(({ nombre, total }, index) => {
            const juezScores = allScores[selectedJuez][activeMod][nombre];
            const isExpanded = expandedAgrupacion === nombre;

            return (
              <div
                key={nombre}
                style={{
                  background: T.bgCard,
                  borderRadius: T.rSm,
                  border: `1px solid ${index === 0 ? mod.color + "40" : T.border}`,
                  overflow: "hidden",
                  boxShadow: index === 0 ? T.shadowMd : T.shadow,
                  marginBottom: 8
                }}
              >
                <button
                  onClick={() => setExpandedAgrupacion(isExpanded ? null : nombre)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: index === 0 ? `${mod.color}08` : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: T.font,
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                    {index < 3 && (
                      <span style={{ fontSize: 16, flexShrink: 0 }}>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                    )}
                    <div style={{ fontWeight: 600, fontSize: 14, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {nombre}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: mod.color }}>
                      {total.toFixed(1)}
                    </div>
                    <span style={{ fontSize: 14, color: T.textSec, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                      ▼
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div style={{
                    padding: "8px 14px 12px",
                    borderTop: `1px solid ${T.border}`,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "6px 12px"
                  }}>
                    {scoreDef.map((s) => {
                      const val = juezScores[s.key];
                      if (val === undefined || val === null || val === "") return null;

                      return (
                        <div
                          key={s.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "4px 6px",
                            background: T.bgWarm,
                            borderRadius: 6,
                            gap: 6
                          }}
                        >
                          <div style={{ fontSize: 11, color: T.textSec, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {s.label}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: T.text,
                              flexShrink: 0
                            }}
                          >
                            {val}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ============================================
// POR AGRUPACIÓN VIEW
// ============================================
function PorAgrupacionView({ allScores, jueces }) {
  const [activeMod, setActiveMod] = useState("comparsas");
  const [selectedAgr, setSelectedAgr] = useState(null);

  const mod = MODALIDADES[activeMod];
  const agrs = AGRUPACIONES[activeMod];
  const scoreDef = SCORING[activeMod];
  const maxTotal = scoreDef.reduce((s, d) => s + d.max, 0);

  // Calcular el total de puntos que un juez ha dado a una agrupación
  const getJuezTotal = (juezName, modalidad, agrupacion) => {
    const juezScores = allScores[juezName];
    if (!juezScores || !juezScores[modalidad] || !juezScores[modalidad][agrupacion]) {
      return null;
    }

    const scores = juezScores[modalidad][agrupacion];
    return scoreDef.reduce((sum, d) => sum + (scores[d.key] || 0), 0);
  };

  // Calcular la media de puntos de todos los jueces para una agrupación
  const getMediaTotal = (modalidad, agrupacion) => {
    const totales = jueces
      .map(j => getJuezTotal(j, modalidad, agrupacion))
      .filter(t => t !== null);

    if (totales.length === 0) return null;
    return totales.reduce((a, b) => a + b, 0) / totales.length;
  };

  // Calcular la media por criterio
  const getMediaPorCriterio = (modalidad, agrupacion, key) => {
    const valores = jueces
      .map(j => {
        const juezScores = allScores[j];
        return juezScores?.[modalidad]?.[agrupacion]?.[key];
      })
      .filter(v => v !== undefined && v !== null && v !== "");

    if (valores.length === 0) return null;
    return valores.reduce((a, b) => a + b, 0) / valores.length;
  };

  // Obtener todas las agrupaciones puntuadas con su media
  const getAgrupacionesConMedia = () => {
    return agrs.map(nombre => {
      const media = getMediaTotal(activeMod, nombre);
      return { nombre, media };
    }).filter(a => a.media !== null)
      .sort((a, b) => b.media - a.media);
  };

  return (
    <>
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
        // Lista de agrupaciones con predicción media
        <>
          <div
            style={{
              background: `${mod.color}10`,
              borderRadius: T.r,
              padding: "14px 16px",
              marginBottom: 14,
              border: `1px solid ${mod.color}30`
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: T.textSec, marginBottom: 4 }}>
              Predicción del Jurado
            </div>
            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>
              Medias de las puntuaciones de todos los participantes.
            </div>
          </div>

          <div className="agrupaciones-grid" style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {getAgrupacionesConMedia().map(({ nombre, media }, index) => (
              <button
                key={nombre}
                onClick={() => setSelectedAgr(nombre)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "13px 14px",
                  borderRadius: T.rSm,
                  border: `1px solid ${mod.color}30`,
                  background: index === 0 ? `${mod.color}08` : T.bgCard,
                  cursor: "pointer",
                  fontFamily: T.font,
                  textAlign: "left",
                  boxShadow: index === 0 ? T.shadowMd : T.shadow
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                  {index < 3 && (
                    <span style={{ fontSize: 16, flexShrink: 0 }}>
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: index === 0 ? 700 : 500,
                        color: T.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {nombre}
                    </div>
                    <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>
                      {jueces.filter(j => getJuezTotal(j, activeMod, nombre) !== null).length} jueces
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span
                    style={{ fontSize: 16, fontWeight: 700, color: mod.color }}
                  >
                    {media.toFixed(1)}
                  </span>
                  <span style={{ color: T.textSec, fontSize: 16 }}>›</span>
                </div>
              </button>
            ))}
            {getAgrupacionesConMedia().length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: 24,
                  color: T.textSec,
                  fontSize: 13,
                  lineHeight: 1.6
                }}
              >
                Aún no hay predicciones de puntuación para esta modalidad.
              </div>
            )}
          </div>
        </>
      ) : (
        // Detalle de una agrupación específica
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

          {/* Cabecera con media general */}
          <div
            style={{
              background: `${mod.color}10`,
              borderRadius: T.r,
              padding: "16px 18px",
              marginBottom: 14,
              border: `1px solid ${mod.color}30`
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 6 }}>
              {selectedAgr}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <Tag color={mod.color}>{mod.label}</Tag>
              <div style={{ fontSize: 13, color: T.textSec }}>
                Predicción del jurado:
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: mod.color }}>
                {getMediaTotal(activeMod, selectedAgr)?.toFixed(1) || "—"} / {maxTotal}
              </div>
            </div>
          </div>

          {/* Desglose por criterios - MEDIA DEL JURADO - TABLA COMPACTA EN GRID */}
          <div
            style={{
              background: T.bgCard,
              borderRadius: T.r,
              border: `1px solid ${T.border}`,
              overflow: "hidden",
              boxShadow: T.shadowMd,
              marginBottom: 14
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                background: T.bgWarm,
                borderBottom: `1px solid ${T.border}`,
                fontWeight: 600,
                fontSize: 13,
                color: T.text
              }}
            >
              Media del Jurado
            </div>
            <div style={{
              padding: "10px 16px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "8px"
            }}>
              {scoreDef.map((s) => {
                const media = getMediaPorCriterio(activeMod, selectedAgr, s.key);
                return (
                  <div
                    key={s.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      background: T.bgWarm,
                      borderRadius: 8,
                      gap: 8
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{ fontSize: 12, fontWeight: 500, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      >
                        {s.label}
                      </div>
                      <div style={{ fontSize: 10, color: T.textSec }}>
                        máx. {s.max}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: media !== null ? mod.color : T.textSec,
                        flexShrink: 0
                      }}
                    >
                      {media !== null ? media.toFixed(1) : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Predicciones individuales de cada juez - TABLAS COMPACTAS */}
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textSec, marginBottom: 10 }}>
            Predicciones individuales
          </div>
          {jueces.map(juezName => {
            const total = getJuezTotal(juezName, activeMod, selectedAgr);
            if (total === null) return null;

            const juezScores = allScores[juezName][activeMod][selectedAgr];

            return (
              <div
                key={juezName}
                style={{
                  background: T.bgCard,
                  borderRadius: T.r,
                  border: `1px solid ${T.border}`,
                  overflow: "hidden",
                  boxShadow: T.shadow,
                  marginBottom: 10
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
                  <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>
                    {juezName}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: mod.color }}>
                    {total.toFixed(1)}
                  </div>
                </div>
                <div style={{
                  padding: "8px 14px 12px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "6px 10px"
                }}>
                  {scoreDef.map((s) => {
                    const val = juezScores[s.key];
                    if (val === undefined || val === null || val === "") return null;

                    return (
                      <div
                        key={s.key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "4px 8px",
                          background: T.bgWarm,
                          borderRadius: 6,
                          gap: 6
                        }}
                      >
                        <div style={{ fontSize: 11, color: T.textSec, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {s.label}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.text,
                            flexShrink: 0
                          }}
                        >
                          {val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ============================================
// MAIN JUECES TAB
// ============================================
export function JuecesTab() {
  const [subTab, setSubTab] = useState("agrupacion");
  const [allScores, setAllScores] = useState({});
  const [loading, setLoading] = useState(true);

  // Suscribirse a todas las puntuaciones
  useEffect(() => {
    const unsubscribe = fsSubscribe('scores', 'all', (data) => {
      if (data) {
        setAllScores(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Obtener lista de jueces que han puntuado
  const jueces = Object.keys(allScores);

  if (loading) {
    return (
      <div className="page-content" style={{ padding: "24px 20px 100px" }}>
        <div style={{ textAlign: "center", padding: 40, color: T.textSec }}>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ padding: "24px 20px 100px" }}>
      <Section
        title="Nuestros Jueces"
        subtitle="Las predicciones de puntuación de cada participante y la media del jurado."
      />

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
          { id: "agrupacion", label: "Por Agrupación" },
          { id: "juez", label: "Por Juez" }
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

      {subTab === "agrupacion" ? (
        <PorAgrupacionView allScores={allScores} jueces={jueces} />
      ) : (
        <PorJuezView allScores={allScores} jueces={jueces} />
      )}
    </div>
  );
}
