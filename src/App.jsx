import { useState, useEffect } from 'react';
import { globalCSS, T } from './data/theme';
import { BottomNav } from './components/BottomNav';
import { InicioTab } from './pages/InicioTab';
import { CalendarioTab } from './pages/CalendarioTab';
import { PorraTab } from './pages/PorraTab';
import { JuecesTab } from './pages/JuecesTab';
import { RankingTab } from './pages/RankingTab';
import { AdminPanel } from './pages/AdminPanel';
import { useUser, useConfig } from './hooks/useAppState';

export default function App() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [showAdmin, setShowAdmin] = useState(false);

  const { userName, loading: userLoading, login, logout } = useUser();
  const { config, loading: configLoading } = useConfig();

  // Manejar ruta /admin
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setShowAdmin(true);
    }
  }, []);

  // Mostrar panel admin
  if (showAdmin) {
    return <AdminPanel onClose={() => {
      setShowAdmin(false);
      window.history.pushState({}, '', '/');
    }} />;
  }

  return (
    <>
      <style>{globalCSS}</style>
      <div
        style={{
          minHeight: "100vh",
          background: T.bg,
          fontFamily: T.font
        }}
        className="app-container"
      >
        {activeTab === "inicio" && (
          <InicioTab
            setActive={setActiveTab}
            onAdminClick={() => setShowAdmin(true)}
          />
        )}
        {activeTab === "calendario" && <CalendarioTab />}
        {activeTab === "porra" && (
          <PorraTab
            userName={userName}
            onLogin={login}
            onLogout={logout}
            locked={config.locked}
          />
        )}
        {activeTab === "jueces" && <JuecesTab />}
        {activeTab === "ranking" && (
          <RankingTab resultados={config.resultados} />
        )}
        <BottomNav active={activeTab} setActive={setActiveTab} />
      </div>
    </>
  );
}
