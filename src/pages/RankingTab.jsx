import { useState, useEffect } from 'react';
import { T } from '../data/theme';
import { MODALIDADES, MAX_PASAN } from '../data/constants';
import { PageHeader, Section, Dot } from '../components/ui';
import { fsSubscribe } from '../lib/firebase';
import { getPlayerPredictionsForPhase } from '../hooks/useAppState';

// Configuración de fases
const FASES_CONFIG = {
  cuartos: { label: "Cuartos", order: 1 },
  semifinales: { label: "Semifinales", order: 2 }
};

export function RankingTab({ resultados }) {
  const [allPredictions, setAllPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [expandedFase, setExpandedFase] = useState({});

  useEffect(() => {
    const unsubscribe = fsSubscribe('predictions', 'all', (data) => {
      setAllPredictions(data || {});
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Obtener resultados de una fase (soporta formato nuevo y antiguo)
  const getResultadosForFase = (fase) => {
    return resultados?.[fase]?.quienPasa ||
      (fase === 'cuartos' ? resultados?.quienPasa : null);
  };

  // Calcular aciertos para una fase específica
  const calculateScoreForFase = (playerData, fase) => {
    const faseResultados = getResultadosForFase(fase);
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

  // Calcular puntuación total (suma de todas las fases)
  const calculateTotalScore = (playerData) => {
    let total = 0;
    let hasAnyResults = false;

    Object.keys(FASES_CONFIG).forEach(fase => {
      const score = calculateScoreForFase(playerData, fase);
      if (score !== null) {
        total += score;
        hasAnyResults = true;
      }
    });

    return hasAnyResults ? total : null;
  };

  // Contar predicciones totales de un jugador (todas las fases)
  const countTotalPredictions = (playerData) => {
    let total = 0;
    Object.keys(FASES_CONFIG).forEach(fase => {
      const predictions = getPlayerPredictionsForPhase(playerData, fase);
      if (predictions) {
        Object.entries(predictions).forEach(([k, arr]) => {
          if (MODALIDADES[k] && Array.isArray(arr)) {
            total += arr.length;
          }
        });
      }
    });
    return total;
  };

  // Preparar lista de jugadores con scores totales
  const players = Object.entries(allPredictions)
    .map(([name, data]) => {
      const totalPicks = countTotalPredictions(data);
      const totalScore = calculateTotalScore(data);

      // Scores por fase
      const scoresByFase = {};
      Object.keys(FASES_CONFIG).forEach(fase => {
        scoresByFase[fase] = calculateScoreForFase(data, fase);
      });

      return {
        name,
        totalPicks,
        totalScore,
        scoresByFase,
        rawData: data
      };
    })
    .filter(p => p.totalPicks > 0)
    .sort((a, b) => {
      if (a.totalScore !== null && b.totalScore !== null) {
        return b.totalScore - a.totalScore;
      }
      if (a.totalScore !== null) return -1;
      if (b.totalScore !== null) return 1;
      return b.totalPicks - a.totalPicks;
    });

  const hasAnyResults = Object.keys(FASES_CONFIG).some(fase => getResultadosForFase(fase));

  const toggleExpand = (name) => {
    setExpandedPlayer(expandedPlayer === name ? null : name);
    setExpandedFase({});
  };

  const toggleFaseExpand = (playerName, fase) => {
    const key = `${playerName}-${fase}`;
    setExpandedFase(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <PageHeader title="Clasificación" subtitle="Ranking de participantes" />

      <div className="page-content" style={{ padding: "0 20px" }}>
        {/* Banner de estado */}
        {!hasAnyResults ? (
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
              Esperando resultados oficiales
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Los aciertos se contarán cuando se publiquen los resultados de cada fase.
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
              Ranking actualizado
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
              Nadie ha hecho predicciones todavía.
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
                            fontSize: 11,
                            color: T.textSec,
                            marginTop: 2
                          }}
                        >
                          {p.totalPicks} predicciones
                          {Object.entries(p.scoresByFase).map(([fase, score]) => (
                            score !== null && (
                              <span key={fase} style={{ marginLeft: 8 }}>
                                • {FASES_CONFIG[fase].label}: {score}
                              </span>
                            )
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: hasAnyResults ? T.primary : T.border
                          }}
                        >
                          {p.totalScore !== null ? p.totalScore : "—"}
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

                    {/* Predicciones expandidas - por fase */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: "8px 16px 16px",
                          borderTop: `1px solid ${T.border}`,
                          background: T.bgWarm
                        }}
                      >
                        {Object.entries(FASES_CONFIG)
                          .sort((a, b) => a[1].order - b[1].order)
                          .map(([faseKey, faseData]) => {
                            const fasePredictions = getPlayerPredictionsForPhase(p.rawData, faseKey);
                            const faseResultados = getResultadosForFase(faseKey);
                            const faseScore = p.scoresByFase[faseKey];
                            const hasPredictions = fasePredictions &&
                              Object.values(fasePredictions).some(arr => arr?.length > 0);

                            if (!hasPredictions) return null;

                            const isOpen = expandedFase[`${p.name}-${faseKey}`];

                            return (
                              <div key={faseKey} style={{ marginTop: 8 }}>
                                {/* Fase header - clickable */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFaseExpand(p.name, faseKey);
                                  }}
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "10px 12px",
                                    borderRadius: T.rSm,
                                    border: `1px solid ${T.border}`,
                                    background: isOpen ? T.bgCard : "transparent",
                                    cursor: "pointer",
                                    fontFamily: T.font
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>
                                      {faseData.label}
                                    </span>
                                    {faseScore !== null && (
                                      <span
                                        style={{
                                          fontSize: 11,
                                          padding: "2px 8px",
                                          borderRadius: T.rPill,
                                          background: T.primary,
                                          color: "#fff",
                                          fontWeight: 600
                                        }}
                                      >
                                        {faseScore} aciertos
                                      </span>
                                    )}
                                    {!faseResultados && (
                                      <span
                                        style={{
                                          fontSize: 11,
                                          padding: "2px 8px",
                                          borderRadius: T.rPill,
                                          background: T.border,
                                          color: T.textSec,
                                          fontWeight: 500
                                        }}
                                      >
                                        Pendiente
                                      </span>
                                    )}
                                  </div>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      color: T.textSec,
                                      transition: "transform 0.2s",
                                      transform: isOpen ? "rotate(180deg)" : "rotate(0)"
                                    }}
                                  >
                                    ▼
                                  </span>
                                </button>

                                {/* Predicciones de la fase */}
                                {isOpen && fasePredictions && (
                                  <div
                                    style={{
                                      marginTop: 8,
                                      padding: "12px",
                                      background: T.bgCard,
                                      borderRadius: T.rSm,
                                      border: `1px solid ${T.border}`
                                    }}
                                  >
                                    {Object.entries(MODALIDADES).map(([modKey, mod]) => {
                                      const picks = fasePredictions[modKey] || [];
                                      if (picks.length === 0) return null;

                                      const maxPasan = MAX_PASAN[faseKey]?.[modKey] || 4;

                                      return (
                                        <div key={modKey} style={{ marginBottom: 10 }}>
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
                                  </div>
                                )}
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
            Un punto por cada agrupación acertada. La puntuación total es la suma de todas las fases.
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
