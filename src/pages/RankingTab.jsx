import { useState, useEffect } from 'react';
import { T } from '../data/theme';
import { MODALIDADES } from '../data/constants';
import { PageHeader, Section, Dot } from '../components/ui';
import { fsSubscribe } from '../lib/firebase';
import { getPlayerPredictionsForPhase } from '../hooks/useAppState';

// Configuración de fases con sus resultados y max por modalidad
const FASES_CONFIG = {
  cuartos: {
    label: "Cuartos",
    maxPasan: { coros: 7, comparsas: 10, chirigotas: 10, cuartetos: 5 }
  },
  semifinales: {
    label: "Semifinales",
    maxPasan: { coros: 4, comparsas: 4, chirigotas: 4, cuartetos: 4 }
  }
};

export function RankingTab({ resultados }) {
  const [allPredictions, setAllPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [selectedFase, setSelectedFase] = useState("cuartos");

  useEffect(() => {
    const unsubscribe = fsSubscribe('predictions', 'all', (data) => {
      setAllPredictions(data || {});
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Calcular aciertos para una fase específica
  const calculateScoreForFase = (playerData, fase) => {
    // Buscar resultados en el nuevo formato (resultados.cuartos.quienPasa)
    // o en el formato antiguo (resultados.quienPasa)
    const faseResultados = resultados?.[fase]?.quienPasa || (fase === 'cuartos' ? resultados?.quienPasa : null);
    if (!faseResultados) return null;

    const predictions = getPlayerPredictionsForPhase(playerData, fase);
    if (!predictions) return 0;

    let aciertos = 0;
    Object.keys(MODALIDADES).forEach(mod => {
      const predicted = predictions[mod] || [];
      const actual = faseResultados[mod] || [];
      predicted.forEach(p => {
        if (actual.includes(p)) aciertos++;
      });
    });
    return aciertos;
  };

  // Preparar lista de jugadores con scores por fase
  const players = Object.entries(allPredictions)
    .map(([name, data]) => {
      // Contar predicciones totales
      let totalPicks = 0;
      let completedMods = [];

      // Predicciones de la fase seleccionada
      const fasePredictions = getPlayerPredictionsForPhase(data, selectedFase);
      if (fasePredictions) {
        Object.entries(fasePredictions).forEach(([k, arr]) => {
          if (MODALIDADES[k] && Array.isArray(arr)) {
            totalPicks += arr.length;
            if (arr.length > 0) completedMods.push(k);
          }
        });
      }

      const scoreForFase = calculateScoreForFase(data, selectedFase);

      return {
        name,
        totalPicks,
        completedMods,
        score: scoreForFase,
        predictions: fasePredictions || {},
        rawData: data
      };
    })
    .filter(p => p.totalPicks > 0) // Solo mostrar jugadores con predicciones en esta fase
    .sort((a, b) => {
      if (a.score !== null && b.score !== null) {
        return b.score - a.score;
      }
      return b.totalPicks - a.totalPicks;
    });

  // Buscar resultados en el nuevo formato o formato antiguo
  const faseResultados = resultados?.[selectedFase]?.quienPasa ||
    (selectedFase === 'cuartos' ? resultados?.quienPasa : null);
  const hasResults = !!faseResultados;

  const toggleExpand = (name) => {
    setExpandedPlayer(expandedPlayer === name ? null : name);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <PageHeader title="Clasificación" subtitle="Ranking de participantes" />

      <div className="page-content" style={{ padding: "0 20px" }}>
        {/* Selector de fase */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            background: T.bgWarm,
            borderRadius: T.rSm,
            padding: 4,
            border: `1px solid ${T.border}`
          }}
        >
          {Object.entries(FASES_CONFIG).map(([faseKey, faseData]) => (
            <button
              key={faseKey}
              onClick={() => {
                setSelectedFase(faseKey);
                setExpandedPlayer(null);
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
                background: selectedFase === faseKey ? T.bgCard : "transparent",
                color: selectedFase === faseKey ? T.text : T.textSec,
                boxShadow: selectedFase === faseKey ? T.shadow : "none"
              }}
            >
              {faseData.label}
            </button>
          ))}
        </div>

        {/* Banner de estado */}
        {!hasResults ? (
          <div
            style={{
              background: `linear-gradient(135deg, #6B2C4A, #4A1A30)`,
              borderRadius: T.r,
              padding: "18px 20px",
              color: T.textLight,
              marginBottom: 20,
              boxShadow: T.shadowMd
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              Esperando resultados de {FASES_CONFIG[selectedFase].label}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Los aciertos se contarán cuando se publiquen los resultados.
            </div>
          </div>
        ) : (
          <div
            style={{
              background: `linear-gradient(135deg, #5DB89C, #3D8B73)`,
              borderRadius: T.r,
              padding: "18px 20px",
              color: T.textLight,
              marginBottom: 20,
              boxShadow: T.shadowMd
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              Resultados de {FASES_CONFIG[selectedFase].label} publicados
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Los aciertos ya están contabilizados.
            </div>
          </div>
        )}
      </div>

      <div className="page-content" style={{ padding: "0 20px" }}>
        <Section title="Participantes" subtitle="Toca en un nombre para ver sus predicciones">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: T.textSec }}>
              <div
                className="spin"
                style={{
                  width: 24,
                  height: 24,
                  border: `2px solid ${T.border}`,
                  borderTopColor: T.primary,
                  borderRadius: "50%",
                  margin: "0 auto 12px"
                }}
              />
              Cargando...
            </div>
          ) : players.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: T.textSec,
                fontSize: 13,
                lineHeight: 1.6
              }}
            >
              Nadie ha hecho predicciones de {FASES_CONFIG[selectedFase].label} todavía.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {players.map((p, i) => {
                const isExpanded = expandedPlayer === p.name;
                return (
                  <div
                    key={p.name}
                    style={{
                      background: T.bgCard,
                      borderRadius: T.rSm,
                      border: isExpanded
                        ? `1.5px solid ${T.primary}`
                        : `1px solid ${T.border}`,
                      overflow: "hidden",
                      boxShadow: isExpanded ? T.shadowMd : T.shadow,
                      transition: "all 0.2s ease"
                    }}
                  >
                    {/* Header clickable */}
                    <div
                      onClick={() => toggleExpand(p.name)}
                      style={{
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        cursor: "pointer",
                        background: isExpanded ? T.primarySoft : "transparent"
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 99,
                          background:
                            i === 0
                              ? T.primary
                              : i === 1
                              ? "#B0B0B0"
                              : i === 2
                              ? "#C8956A"
                              : T.border,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 800,
                          fontSize: 13,
                          flexShrink: 0
                        }}
                      >
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>
                          {p.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            marginTop: 4,
                            flexWrap: "wrap",
                            alignItems: "center"
                          }}
                        >
                          {p.completedMods.map(k => (
                            <Dot key={k} color={MODALIDADES[k].color} size={7} />
                          ))}
                          <span style={{ fontSize: 11, color: T.textSec, marginLeft: 4 }}>
                            {p.totalPicks} predicciones
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: hasResults ? T.primary : T.border
                          }}
                        >
                          {p.score !== null ? p.score : "—"}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: T.textSec,
                            transition: "transform 0.2s",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0)"
                          }}
                        >
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* Predicciones expandidas */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: "12px 16px 16px",
                          borderTop: `1px solid ${T.border}`,
                          background: T.bgWarm
                        }}
                      >
                        {Object.entries(MODALIDADES).map(([modKey, mod]) => {
                          const picks = p.predictions[modKey] || [];
                          if (picks.length === 0) return null;

                          const maxPasan = FASES_CONFIG[selectedFase].maxPasan[modKey];

                          return (
                            <div key={modKey} style={{ marginBottom: 12 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  marginBottom: 6
                                }}
                              >
                                <Dot color={mod.color} size={8} />
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: mod.color
                                  }}
                                >
                                  {mod.label}s ({picks.length}/{maxPasan})
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 4
                                }}
                              >
                                {picks.map(pick => {
                                  const actualResults = faseResultados?.[modKey] || [];
                                  const isCorrect = actualResults.includes(pick);
                                  const isWrong = faseResultados && !isCorrect;

                                  return (
                                    <span
                                      key={pick}
                                      style={{
                                        fontSize: 11,
                                        padding: "3px 8px",
                                        borderRadius: T.rPill,
                                        background: isCorrect
                                          ? `${mod.color}`
                                          : isWrong
                                          ? "#FFEBEE"
                                          : `${mod.color}15`,
                                        color: isCorrect
                                          ? "#fff"
                                          : isWrong
                                          ? "#D32F2F"
                                          : mod.color,
                                        fontWeight: isCorrect ? 700 : 500,
                                        textDecoration: isWrong ? "line-through" : "none",
                                        opacity: isWrong ? 0.7 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        boxShadow: isCorrect ? `0 2px 4px ${mod.color}40` : "none"
                                      }}
                                    >
                                      {isCorrect && <span>✓</span>}
                                      {pick}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}

                        {p.completedMods.length === 0 && (
                          <div
                            style={{
                              fontSize: 12,
                              color: T.textSec,
                              fontStyle: "italic"
                            }}
                          >
                            Sin predicciones en esta fase
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        <div
          style={{
            background: `${T.wine}08`,
            borderRadius: T.r,
            padding: "18px",
            border: `1px solid ${T.wine}15`
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: T.wine,
              marginBottom: 10
            }}
          >
            Sistema de puntuación
          </div>
          <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7 }}>
            <strong style={{ color: T.wine }}>Juego 1 — ¿Quién pasa?</strong>
            <br />
            Un punto por cada agrupación acertada.
            <br />
            <br />
            <strong style={{ color: T.wine }}>Juego 2 — Puntuación</strong>
            <br />
            Se calcula la diferencia absoluta entre tu predicción y la
            puntuación real. Gana quien menor diferencia acumulada tenga.
          </div>
        </div>
      </div>
    </div>
  );
}
