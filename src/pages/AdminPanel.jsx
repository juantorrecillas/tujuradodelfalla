import { useState, useEffect } from 'react';
import { T } from '../data/theme';
import { MODALIDADES, AGRUPACIONES, AGRUPACIONES_CUARTOS, MAX_PASAN, ADMIN_PIN } from '../data/constants';
import { PageHeader, Section, Dot } from '../components/ui';
import { fsGet, fsSet, fsSubscribe } from '../lib/firebase';
import { migratePredictionsToPhases, fixMoveSemifinalsToQuarters } from '../hooks/useAppState';

const FASES_CONFIG = {
  cuartos: { label: "Cuartos", agrupaciones: AGRUPACIONES_CUARTOS },
  semifinales: { label: "Semifinales", agrupaciones: AGRUPACIONES }
};

export function AdminPanel({ onClose }) {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [config, setConfig] = useState({ fase: 'semifinales', locked: false, resultados: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMod, setSelectedMod] = useState("coros");
  const [selectedFase, setSelectedFase] = useState("cuartos");
  const [selectedPasan, setSelectedPasan] = useState({
    coros: [],
    comparsas: [],
    chirigotas: [],
    cuartetos: []
  });
  const [migrating, setMigrating] = useState(false);
  const [migrationDone, setMigrationDone] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [fixDone, setFixDone] = useState(false);

  // Cargar config al autenticarse
  useEffect(() => {
    if (!authenticated) return;

    const unsubscribe = fsSubscribe('config', 'settings', (data) => {
      if (data) {
        setConfig(data);
        // Cargar resultados de la fase seleccionada
        const faseResults = data.resultados?.[selectedFase]?.quienPasa;
        if (faseResults) {
          setSelectedPasan(faseResults);
        } else {
          setSelectedPasan({ coros: [], comparsas: [], chirigotas: [], cuartetos: [] });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authenticated, selectedFase]);

  // Actualizar selectedPasan cuando cambia la fase
  useEffect(() => {
    if (!config.resultados) return;
    const faseResults = config.resultados[selectedFase]?.quienPasa;
    if (faseResults) {
      setSelectedPasan(faseResults);
    } else {
      setSelectedPasan({ coros: [], comparsas: [], chirigotas: [], cuartetos: [] });
    }
  }, [selectedFase, config.resultados]);

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
    } else {
      alert("PIN incorrecto");
    }
  };

  const toggleLocked = async () => {
    setSaving(true);
    await fsSet('config', 'settings', { ...config, locked: !config.locked });
    setSaving(false);
  };

  const toggleAgrupacion = (modalidad, nombre) => {
    const maxPasan = MAX_PASAN[selectedFase][modalidad];
    setSelectedPasan(prev => {
      const current = prev[modalidad] || [];
      if (current.includes(nombre)) {
        return { ...prev, [modalidad]: current.filter(n => n !== nombre) };
      }
      if (current.length >= maxPasan) {
        return prev; // Ya llegamos al máximo
      }
      return { ...prev, [modalidad]: [...current, nombre] };
    });
  };

  const saveResultados = async () => {
    setSaving(true);
    const newConfig = {
      ...config,
      resultados: {
        ...config.resultados,
        [selectedFase]: {
          ...(config.resultados?.[selectedFase] || {}),
          quienPasa: selectedPasan
        }
      }
    };
    await fsSet('config', 'settings', newConfig);
    setSaving(false);
    alert(`Resultados de ${FASES_CONFIG[selectedFase].label} guardados`);
  };

  const clearResultados = async () => {
    if (!confirm(`¿Seguro que quieres borrar los resultados de ${FASES_CONFIG[selectedFase].label}?`)) return;
    setSaving(true);
    const newConfig = {
      ...config,
      resultados: {
        ...config.resultados,
        [selectedFase]: null
      }
    };
    await fsSet('config', 'settings', newConfig);
    setSelectedPasan({ coros: [], comparsas: [], chirigotas: [], cuartetos: [] });
    setSaving(false);
  };

  const handleMigration = async () => {
    if (!confirm("¿Migrar predicciones antiguas al formato por fases? (Solo necesario una vez)")) return;
    setMigrating(true);
    try {
      await migratePredictionsToPhases();
      setMigrationDone(true);
      alert("Migración completada. Las predicciones antiguas ahora están en 'Cuartos'.");
    } catch (error) {
      alert("Error en migración: " + error.message);
    }
    setMigrating(false);
  };

  const handleFix = async () => {
    if (!confirm("¿Mover predicciones de 'semifinales' a 'cuartos'? Esto arregla el problema donde las predicciones de cuartos acabaron en semifinales.")) return;
    setFixing(true);
    try {
      await fixMoveSemifinalsToQuarters();
      setFixDone(true);
      alert("¡Reparación completada! Las predicciones ahora están en 'Cuartos'. Los usuarios pueden hacer sus predicciones de Semifinales desde cero.");
    } catch (error) {
      alert("Error en reparación: " + error.message);
    }
    setFixing(false);
  };

  const currentAgrupaciones = FASES_CONFIG[selectedFase].agrupaciones;
  const maxPasanForMod = MAX_PASAN[selectedFase][selectedMod];

  // Pantalla de login
  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, padding: 20 }}>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: T.font,
            fontSize: 14,
            color: T.wine,
            fontWeight: 600,
            marginBottom: 20,
            padding: 0
          }}
        >
          ← Volver
        </button>
        <Section title="Panel de Admin" subtitle="Introduce el PIN de administrador">
          <div
            style={{
              background: T.bgCard,
              borderRadius: T.r,
              padding: 22,
              border: `1px solid ${T.border}`,
              boxShadow: T.shadowMd
            }}
          >
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="PIN"
              autoFocus
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: T.rSm,
                border: `1.5px solid ${T.border}`,
                background: T.bgWarm,
                fontFamily: T.font,
                fontSize: 18,
                color: T.text,
                outline: "none",
                textAlign: "center",
                letterSpacing: 8
              }}
            />
            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                marginTop: 14,
                padding: "13px",
                borderRadius: T.rSm,
                border: "none",
                cursor: "pointer",
                fontFamily: T.font,
                fontWeight: 700,
                fontSize: 14,
                background: "#6B2C4A",
                color: T.textLight
              }}
            >
              Entrar
            </button>
          </div>
        </Section>
      </div>
    );
  }

  // Panel de admin
  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <PageHeader title="Admin" subtitle="Panel de administración" />

      <div style={{ padding: "0 20px 100px" }}>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: T.font,
            fontSize: 14,
            color: T.wine,
            fontWeight: 600,
            marginBottom: 20,
            padding: 0
          }}
        >
          ← Volver a la app
        </button>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: T.textSec }}>
            Cargando...
          </div>
        ) : (
          <>
            {/* Control de bloqueo */}
            <Section title="Estado de las predicciones">
              <div
                style={{
                  background: T.bgCard,
                  borderRadius: T.r,
                  padding: 20,
                  border: `1px solid ${T.border}`,
                  boxShadow: T.shadow
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>
                      Predicciones {config.locked ? "bloqueadas" : "abiertas"}
                    </div>
                    <div style={{ fontSize: 12, color: T.textSec, marginTop: 4 }}>
                      {config.locked
                        ? "Los jugadores no pueden modificar sus predicciones"
                        : "Los jugadores pueden modificar sus predicciones"}
                    </div>
                  </div>
                  <button
                    onClick={toggleLocked}
                    disabled={saving}
                    style={{
                      padding: "10px 20px",
                      borderRadius: T.rSm,
                      border: "none",
                      cursor: saving ? "wait" : "pointer",
                      fontFamily: T.font,
                      fontWeight: 600,
                      fontSize: 13,
                      background: config.locked ? "#5DB89C" : "#D4756B",
                      color: T.textLight
                    }}
                  >
                    {config.locked ? "Desbloquear" : "Bloquear"}
                  </button>
                </div>
              </div>
            </Section>

            {/* Resultados oficiales */}
            <Section
              title="Resultados oficiales"
              subtitle="Selecciona qué agrupaciones han pasado de fase"
            >
              {/* Selector de fase para resultados */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 16,
                  background: T.bgWarm,
                  borderRadius: T.rSm,
                  padding: 4,
                  border: `1px solid ${T.border}`
                }}
              >
                {Object.entries(FASES_CONFIG).map(([faseKey, faseData]) => (
                  <button
                    key={faseKey}
                    onClick={() => setSelectedFase(faseKey)}
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
                    {config.resultados?.[faseKey]?.quienPasa && " ✓"}
                  </button>
                ))}
              </div>

              {/* Selector de modalidad */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 16,
                  overflowX: "auto",
                  paddingBottom: 4
                }}
              >
                {Object.entries(MODALIDADES).map(([key, m]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMod(key)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: T.rPill,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: T.font,
                      fontWeight: 600,
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      background: selectedMod === key ? m.color : T.bgCard,
                      color: selectedMod === key ? "#fff" : T.text,
                      boxShadow:
                        selectedMod === key ? `0 2px 8px ${m.color}35` : T.shadow
                    }}
                  >
                    {m.label} ({(selectedPasan[key] || []).length}/{MAX_PASAN[selectedFase][key]})
                  </button>
                ))}
              </div>

              {/* Lista de agrupaciones */}
              <div
                style={{
                  background: T.bgCard,
                  borderRadius: T.r,
                  border: `1px solid ${T.border}`,
                  padding: 12,
                  maxHeight: 300,
                  overflowY: "auto"
                }}
              >
                {currentAgrupaciones[selectedMod].map(nombre => {
                  const selected = (selectedPasan[selectedMod] || []).includes(nombre);
                  return (
                    <button
                      key={nombre}
                      onClick={() => toggleAgrupacion(selectedMod, nombre)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "10px 12px",
                        marginBottom: 4,
                        borderRadius: T.rSm,
                        border: selected
                          ? `1.5px solid ${MODALIDADES[selectedMod].color}`
                          : `1px solid ${T.border}`,
                        background: selected
                          ? `${MODALIDADES[selectedMod].color}15`
                          : "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: T.font
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          border: selected
                            ? "none"
                            : `2px solid ${T.border}`,
                          background: selected
                            ? MODALIDADES[selectedMod].color
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        {selected && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: selected ? 600 : 400,
                          color: selected ? T.text : T.textSec
                        }}
                      >
                        {nombre}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Botones de acción */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 16
                }}
              >
                <button
                  onClick={saveResultados}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "13px",
                    borderRadius: T.rSm,
                    border: "none",
                    cursor: saving ? "wait" : "pointer",
                    fontFamily: T.font,
                    fontWeight: 700,
                    fontSize: 14,
                    background: "#5DB89C",
                    color: T.textLight
                  }}
                >
                  {saving ? "Guardando..." : `Guardar ${FASES_CONFIG[selectedFase].label}`}
                </button>
                <button
                  onClick={clearResultados}
                  disabled={saving}
                  style={{
                    padding: "13px 20px",
                    borderRadius: T.rSm,
                    border: `1px solid ${T.border}`,
                    cursor: saving ? "wait" : "pointer",
                    fontFamily: T.font,
                    fontWeight: 600,
                    fontSize: 14,
                    background: T.bgCard,
                    color: T.textSec
                  }}
                >
                  Borrar
                </button>
              </div>
            </Section>

            {/* Migración de datos */}
            <Section title="Mantenimiento">
              <div
                style={{
                  background: T.bgCard,
                  borderRadius: T.r,
                  padding: 16,
                  border: `1px solid ${T.border}`,
                  boxShadow: T.shadow
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: T.text, marginBottom: 8 }}>
                  Migrar predicciones antiguas
                </div>
                <div style={{ fontSize: 12, color: T.textSec, marginBottom: 12, lineHeight: 1.5 }}>
                  Si hay predicciones del formato antiguo (sin separación por fases),
                  este botón las moverá a "Cuartos". Solo es necesario ejecutarlo una vez.
                </div>
                <button
                  onClick={handleMigration}
                  disabled={migrating || migrationDone}
                  style={{
                    padding: "10px 16px",
                    borderRadius: T.rSm,
                    border: "none",
                    cursor: migrating || migrationDone ? "not-allowed" : "pointer",
                    fontFamily: T.font,
                    fontWeight: 600,
                    fontSize: 13,
                    background: migrationDone ? "#5DB89C" : T.wine,
                    color: T.textLight,
                    opacity: migrationDone ? 0.7 : 1
                  }}
                >
                  {migrating ? "Migrando..." : migrationDone ? "Migración completada ✓" : "Ejecutar migración"}
                </button>

                {/* Reparación: mover semifinales a cuartos */}
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#D4756B", marginBottom: 8 }}>
                    Reparar: Semifinales → Cuartos
                  </div>
                  <div style={{ fontSize: 12, color: T.textSec, marginBottom: 12, lineHeight: 1.5 }}>
                    Si las predicciones de cuartos acabaron guardadas en "semifinales" por error,
                    este botón las mueve a "cuartos" para que los usuarios puedan hacer sus predicciones de semifinales desde cero.
                  </div>
                  <button
                    onClick={handleFix}
                    disabled={fixing || fixDone}
                    style={{
                      padding: "10px 16px",
                      borderRadius: T.rSm,
                      border: "none",
                      cursor: fixing || fixDone ? "not-allowed" : "pointer",
                      fontFamily: T.font,
                      fontWeight: 600,
                      fontSize: 13,
                      background: fixDone ? "#5DB89C" : "#D4756B",
                      color: T.textLight,
                      opacity: fixDone ? 0.7 : 1
                    }}
                  >
                    {fixing ? "Reparando..." : fixDone ? "Reparación completada ✓" : "Mover a Cuartos"}
                  </button>
                </div>
              </div>
            </Section>

            {/* Info de fase */}
            <Section title="Información">
              <div
                style={{
                  background: `${T.wine}08`,
                  borderRadius: T.r,
                  padding: 16,
                  border: `1px solid ${T.wine}15`,
                  fontSize: 12,
                  color: T.text,
                  lineHeight: 1.7
                }}
              >
                <strong>Fase actual:</strong> {config.fase}
                <br />
                <strong>Predicciones:</strong>{" "}
                {config.locked ? "Bloqueadas" : "Abiertas"}
                <br />
                <strong>Resultados Cuartos:</strong>{" "}
                {config.resultados?.cuartos?.quienPasa ? "Publicados" : "Pendientes"}
                <br />
                <strong>Resultados Semifinales:</strong>{" "}
                {config.resultados?.semifinales?.quienPasa ? "Publicados" : "Pendientes"}
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}
