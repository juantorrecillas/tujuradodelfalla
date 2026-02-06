import { useState, useEffect } from 'react';
import { T } from '../data/theme';
import { MODALIDADES } from '../data/constants';
import { PageHeader, Section, Dot } from '../components/ui';
import { fsSubscribe } from '../lib/firebase';

export function RankingTab({ resultados }) {
  const [allPredictions, setAllPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  useEffect(() => {
    const unsubscribe = fsSubscribe('predictions', 'all', (data) => {
      setAllPredictions(data || {});
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Calcular aciertos si hay resultados
  const calculateScore = (playerPredictions) => {
    if (!resultados?.quienPasa) return null;

    let aciertos = 0;
    Object.keys(MODALIDADES).forEach(mod => {
      const predicted = playerPredictions[mod] || [];
      const actual = resultados.quienPasa[mod] || [];
      predicted.forEach(p => {
        if (actual.includes(p)) aciertos++;
      });
    });
    return aciertos;
  };

  // Preparar lista de jugadores
  const players = Object.entries(allPredictions)
    .map(([name, data]) => {
      const { updatedAt, ...mods } = data;
      const totalPicks = Object.values(mods).reduce(
        (s, arr) => s + (Array.isArray(arr) ? arr.length : 0),
        0
      );
      const completedMods = Object.entries(mods)
        .filter(
          ([k, arr]) =>
            MODALIDADES[k] && Array.isArray(arr) && arr.length > 0
        )
        .map(([k]) => k);

      const score = calculateScore(mods);

      return { name, totalPicks, completedMods, score, predictions: mods };
    })
    .sort((a, b) => {
      if (a.score !== null && b.score !== null) {
        return b.score - a.score;
      }
      return b.totalPicks - a.totalPicks;
    });

  const hasResults = resultados?.quienPasa;

  const toggleExpand = (name) => {
    setExpandedPlayer(expandedPlayer === name ? null : name);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <PageHeader title="Clasificación" subtitle="Ranking de participantes" />
      <div className="page-content" style={{ padding: "0 20px" }}>
        {!hasResults ? (
          <div
            style={{
              background: `linear-gradient(135deg, #6B2C4A, #4A1A30)`,
              borderRadius: T.r,
              padding: "22px 20px",
              color: T.textLight,
              marginBottom: 24,
              boxShadow: T.shadowMd
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
              Esperando al fallo del jurado
            </div>
            <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.6 }}>
              Los aciertos se contarán cuando se publiquen los resultados de
              cada fase. Los puntos se compararán al final del concurso.
            </div>
          </div>
        ) : (
          <div
            style={{
              background: `linear-gradient(135deg, #5DB89C, #3D8B73)`,
              borderRadius: T.r,
              padding: "22px 20px",
              color: T.textLight,
              marginBottom: 24,
              boxShadow: T.shadowMd
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
              Resultados publicados
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>
              Los aciertos de "¿Quién pasa?" ya están contabilizados.
            </div>
          </div>
        )}
      </div>

      <div className="page-content" style={{ padding: "0 20px" }}>
        <Section title="Participantes" subtitle="Toca en un nombre para ver sus predicciones">
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: T.textSec
              }}
            >
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
              Nadie ha hecho su porra todavía.
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
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
                        <div
                          style={{ fontWeight: 700, fontSize: 14, color: T.text }}
                        >
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
                          <span
                            style={{
                              fontSize: 11,
                              color: T.textSec,
                              marginLeft: 4
                            }}
                          >
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
                                  {mod.label}s ({picks.length}/{mod.maxPasan})
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
                                  const actualResults = resultados?.quienPasa?.[modKey] || [];
                                  const isCorrect = actualResults.includes(pick);
                                  const isWrong = resultados?.quienPasa && !isCorrect;

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
                            Sin predicciones todavía
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
