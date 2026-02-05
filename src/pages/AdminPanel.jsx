import { useState, useEffect } from 'react';
import { T } from '../data/theme';
import { MODALIDADES, AGRUPACIONES, ADMIN_PIN } from '../data/constants';
import { PageHeader, Section, Dot } from '../components/ui';
import { fsGet, fsSet, fsSubscribe } from '../lib/firebase';

export function AdminPanel({ onClose }) {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [config, setConfig] = useState({ fase: 'cuartos', locked: false, resultados: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMod, setSelectedMod] = useState("coros");
  const [selectedPasan, setSelectedPasan] = useState({
    coros: [],
    comparsas: [],
    chirigotas: [],
    cuartetos: []
  });

  // Cargar config al autenticarse
  useEffect(() => {
    if (!authenticated) return;

    const unsubscribe = fsSubscribe('config', 'settings', (data) => {
      if (data) {
        setConfig(data);
        if (data.resultados?.quienPasa) {
          setSelectedPasan(data.resultados.quienPasa);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authenticated]);

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
    setSelectedPasan(prev => {
      const current = prev[modalidad] || [];
      if (current.includes(nombre)) {
        return { ...prev, [modalidad]: current.filter(n => n !== nombre) };
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
        quienPasa: selectedPasan
      }
    };
    await fsSet('config', 'settings', newConfig);
    setSaving(false);
    alert("Resultados guardados");
  };

  const clearResultados = async () => {
    if (!confirm("¿Seguro que quieres borrar los resultados?")) return;
    setSaving(true);
    const newConfig = {
      ...config,
      resultados: null
    };
    await fsSet('config', 'settings', newConfig);
    setSelectedPasan({ coros: [], comparsas: [], chirigotas: [], cuartetos: [] });
    setSaving(false);
  };

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
                    {m.label} ({(selectedPasan[key] || []).length}/{m.maxPasan})
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
                {AGRUPACIONES[selectedMod].map(nombre => {
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
                  {saving ? "Guardando..." : "Guardar resultados"}
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
                <strong>Resultados:</strong>{" "}
                {config.resultados?.quienPasa ? "Publicados" : "Pendientes"}
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}
