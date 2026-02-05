// Tema visual de la aplicación
export const T = {
  // Colores base
  bg: "#F6F3EE",
  bgCard: "#FFFFFF",
  bgWarm: "#FAF8F5",

  // Colores de texto
  dark: "#2C2438",
  text: "#2C2438",
  textSec: "#8A8494",
  textLight: "#FFFFFF",

  // Colores de acento
  primary: "#C89B5E",
  primarySoft: "#F5EDE0",
  accent: "#D4756B",

  // Colores de marca
  wine: "#6B2C4A",
  wineLight: "#8E3B56",
  gold: "#F5D76E",

  // Bordes y sombras
  border: "#EBE7E1",
  shadow: "0 1px 6px rgba(44,36,56,0.06)",
  shadowMd: "0 4px 16px rgba(44,36,56,0.08)",

  // Border radius
  r: "16px",
  rSm: "10px",
  rPill: "99px",

  // Fuentes
  font: "'Manrope', sans-serif",
  fontDisplay: "'Playfair Display', serif",
};

// CSS global
export const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: ${T.font};
  background: ${T.bg};
  -webkit-font-smoothing: antialiased;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

::placeholder {
  color: ${T.textSec};
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up {
  animation: fadeUp .35s ease both;
}

/* Hero styles */
.hero-tag {
  font-size: 11px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #F5D76E;
  font-weight: 700;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  line-height: 1.12;
  margin-top: 10px;
  margin-bottom: 14px;
  color: #FFFFFF;
}

.hero-subtitle {
  font-size: 28px;
}

.hero-description {
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.6;
  max-width: 300px;
  color: rgba(255,255,255,.8);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Responsive layout */
.app-container {
  max-width: 480px;
  margin: 0 auto;
}

.content-wrapper {
  padding: 0 20px;
}

/* Tablet and desktop */
@media (min-width: 768px) {
  .app-container {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    margin-left: 220px;
  }

  .page-content {
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    padding: 0 40px !important;
  }

  .content-wrapper {
    padding: 0;
  }

  /* Texto más grande en desktop */
  body {
    font-size: 17px;
  }

  /* Textos generales más grandes */
  p, span, div, label {
    font-size: 15px;
  }

  input, select, textarea {
    font-size: 16px !important;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  /* Bottom nav becomes sidebar on desktop */
  .bottom-nav {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
    right: auto !important;
    width: 220px !important;
    flex-direction: column !important;
    padding: 24px 16px !important;
    padding-bottom: 24px !important;
    border-top: none !important;
    border-right: 1px solid #EBE7E1 !important;
    justify-content: flex-start !important;
    gap: 4px !important;
  }

  .bottom-nav .nav-logo {
    display: block !important;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #EBE7E1;
  }

  .bottom-nav .nav-button {
    flex: none !important;
    flex-direction: row !important;
    justify-content: flex-start !important;
    padding: 12px 16px !important;
    border-radius: 10px !important;
    gap: 12px !important;
    font-size: 15px !important;
    width: 100%;
  }

  .bottom-nav .nav-button:hover {
    background: rgba(200, 155, 94, 0.1) !important;
  }

  /* Hero en desktop - centrado y más espaciado */
  .hero-section {
    padding: 80px 60px 70px !important;
    text-align: center !important;
  }

  .hero-content {
    max-width: 650px;
    margin: 0 auto;
  }

  .hero-tag {
    font-size: 13px !important;
    letter-spacing: 3px !important;
  }

  .hero-title {
    font-size: 52px !important;
    letter-spacing: -0.5px;
    margin-top: 14px !important;
    margin-bottom: 20px !important;
  }

  .hero-subtitle {
    font-size: 38px !important;
  }

  .hero-description {
    font-size: 17px !important;
    max-width: 480px !important;
    margin: 0 auto !important;
    opacity: 0.8;
  }

  /* Cards in grid */
  .sessions-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)) !important;
    gap: 16px !important;
  }

  .agrupaciones-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
    gap: 10px !important;
  }

  .stats-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 16px !important;
  }

  /* Textos más grandes en secciones */
  h2 {
    font-size: 28px !important;
  }

  /* Escalar todo el contenido en desktop */
  .app-container {
    zoom: 1.1;
  }

  /* Compensar el zoom en la navegación */
  .bottom-nav {
    zoom: 1;
  }
}

/* Large desktop */
@media (min-width: 1200px) {
  .page-content {
    max-width: 1100px;
    padding: 0 60px !important;
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .sessions-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }

  .agrupaciones-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}
`;
