import { useState, useEffect, useCallback } from 'react';
import { fsGet, fsSet, fsSubscribe, localGet, localSet } from '../lib/firebase';

/**
 * Hook para manejar el estado del usuario (nombre guardado en localStorage)
 */
export function useUser() {
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const identity = localGet('my-identity');
    if (identity?.name) {
      setUserName(identity.name);
    }
    setLoading(false);
  }, []);

  const login = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    localSet('my-identity', { name: trimmed });
    setUserName(trimmed);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUserName(null);
  }, []);

  return { userName, loading, login, logout };
}

/**
 * Hook para manejar la configuración global (fase, locked, resultados)
 */
export function useConfig() {
  const [config, setConfig] = useState({
    fase: 'semifinales',
    locked: false,
    resultados: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fsSubscribe('config', 'settings', (data) => {
      if (data) {
        setConfig(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateConfig = useCallback(async (updates) => {
    const newConfig = { ...config, ...updates };
    await fsSet('config', 'settings', newConfig);
  }, [config]);

  return { config, loading, updateConfig };
}

/**
 * Hook para manejar las predicciones de "quién pasa" - CON HISTÓRICO POR FASE
 */
export function usePredictions(userName, fase = 'semifinales') {
  const [allPredictions, setAllPredictions] = useState({});
  const [myPredictions, setMyPredictions] = useState({
    coros: [],
    comparsas: [],
    chirigotas: [],
    cuartetos: []
  });
  const [loading, setLoading] = useState(true);

  // Suscribirse a todas las predicciones en tiempo real
  useEffect(() => {
    const unsubscribe = fsSubscribe('predictions', 'all', (data) => {
      if (data) {
        setAllPredictions(data);
        // Actualizar mis predicciones de la fase actual si estoy logueado
        if (userName && data[userName]) {
          const playerData = data[userName];
          // Verificar si tiene estructura por fases
          if (playerData[fase]) {
            const { updatedAt, ...rest } = playerData[fase];
            setMyPredictions(prev => ({ ...prev, ...rest }));
          } else if (!playerData.cuartos && !playerData.semifinales) {
            // Formato antiguo (sin fases) - compatibilidad
            const { updatedAt, ...rest } = playerData;
            setMyPredictions(prev => ({ ...prev, ...rest }));
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userName, fase]);

  // Guardar predicciones en la fase actual
  const savePredictions = useCallback(async (predictions) => {
    if (!userName) return;

    const all = await fsGet('predictions', 'all') || {};

    // Guardar en estructura por fases
    if (!all[userName]) {
      all[userName] = {};
    }

    all[userName][fase] = { ...predictions, updatedAt: Date.now() };
    await fsSet('predictions', 'all', all);
  }, [userName, fase]);

  // Toggle una agrupación
  const togglePrediction = useCallback((modalidad, nombre, maxPasan) => {
    setMyPredictions(prev => {
      const current = prev[modalidad] || [];
      let updated;

      if (current.includes(nombre)) {
        updated = current.filter(n => n !== nombre);
      } else if (current.length < maxPasan) {
        updated = [...current, nombre];
      } else {
        return prev;
      }

      const newPredictions = { ...prev, [modalidad]: updated };
      setTimeout(() => savePredictions(newPredictions), 600);

      return newPredictions;
    });
  }, [savePredictions]);

  return {
    allPredictions,
    myPredictions,
    loading,
    togglePrediction,
    setMyPredictions
  };
}

/**
 * Helper para obtener predicciones de una fase específica de un jugador
 */
export function getPlayerPredictionsForPhase(playerData, fase) {
  if (!playerData) return null;

  // Si tiene estructura por fases
  if (playerData[fase]) {
    const { updatedAt, ...rest } = playerData[fase];
    return rest;
  }

  // Formato antiguo (sin fases) - asumir que son de cuartos
  if (!playerData.cuartos && !playerData.semifinales) {
    const { updatedAt, ...rest } = playerData;
    return fase === 'cuartos' ? rest : null;
  }

  return null;
}

/**
 * Hook para manejar las puntuaciones predichas
 */
export function useScores(userName) {
  const [allScores, setAllScores] = useState({});
  const [myScores, setMyScores] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fsSubscribe('scores', 'all', (data) => {
      if (data) {
        setAllScores(data);
        if (userName && data[userName]) {
          const { updatedAt, ...rest } = data[userName];
          setMyScores(rest);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userName]);

  const saveScores = useCallback(async (scores) => {
    if (!userName) return;

    const all = await fsGet('scores', 'all') || {};
    all[userName] = { ...scores, updatedAt: Date.now() };
    await fsSet('scores', 'all', all);
  }, [userName]);

  const setScore = useCallback((modalidad, agrupacion, key, value, maxValue) => {
    const num = Math.min(Math.max(0, Number(value) || 0), maxValue);

    setMyScores(prev => {
      const newScores = {
        ...prev,
        [modalidad]: {
          ...(prev[modalidad] || {}),
          [agrupacion]: {
            ...(prev[modalidad]?.[agrupacion] || {}),
            [key]: num
          }
        }
      };

      setTimeout(() => saveScores(newScores), 600);

      return newScores;
    });
  }, [saveScores]);

  return {
    allScores,
    myScores,
    loading,
    setScore,
    setMyScores
  };
}

/**
 * Función para migrar predicciones del formato antiguo al nuevo (por fases)
 * Ejecutar UNA VEZ desde el panel admin o consola
 */
export async function migratePredictionsToPhases() {
  const all = await fsGet('predictions', 'all') || {};
  const migrated = {};

  for (const [playerName, playerData] of Object.entries(all)) {
    // Si ya tiene estructura por fases, mantener
    if (playerData.cuartos || playerData.semifinales) {
      migrated[playerName] = playerData;
    } else {
      // Formato antiguo - mover a cuartos
      const { updatedAt, ...predictions } = playerData;
      migrated[playerName] = {
        cuartos: { ...predictions, updatedAt }
      };
    }
  }

  await fsSet('predictions', 'all', migrated);
  console.log('Migration complete!', migrated);
  return migrated;
}
