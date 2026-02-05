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
    // No borramos localStorage para que pueda volver con el mismo nombre
  }, []);

  return { userName, loading, login, logout };
}

/**
 * Hook para manejar la configuración global (fase, locked, resultados)
 */
export function useConfig() {
  const [config, setConfig] = useState({
    fase: 'cuartos',
    locked: false,
    resultados: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscribirse a cambios en tiempo real
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
 * Hook para manejar las predicciones de "quién pasa"
 */
export function usePredictions(userName) {
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
        // Actualizar mis predicciones si estoy logueado
        if (userName && data[userName]) {
          const { updatedAt, ...rest } = data[userName];
          setMyPredictions(prev => ({ ...prev, ...rest }));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userName]);

  // Guardar predicciones con debounce
  const savePredictions = useCallback(async (predictions) => {
    if (!userName) return;

    const all = await fsGet('predictions', 'all') || {};
    all[userName] = { ...predictions, updatedAt: Date.now() };
    await fsSet('predictions', 'all', all);
  }, [userName]);

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
        return prev; // Límite alcanzado
      }

      const newPredictions = { ...prev, [modalidad]: updated };

      // Guardar con debounce
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
 * Hook para manejar las puntuaciones predichas
 */
export function useScores(userName) {
  const [allScores, setAllScores] = useState({});
  const [myScores, setMyScores] = useState({});
  const [loading, setLoading] = useState(true);

  // Suscribirse a todas las puntuaciones en tiempo real
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

  // Guardar puntuaciones
  const saveScores = useCallback(async (scores) => {
    if (!userName) return;

    const all = await fsGet('scores', 'all') || {};
    all[userName] = { ...scores, updatedAt: Date.now() };
    await fsSet('scores', 'all', all);
  }, [userName]);

  // Actualizar una puntuación específica
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

      // Guardar con debounce
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
