import { T } from '../../data/theme';

export function PageHeader({ title, subtitle, children }) {
  return (
    <div
      className="hero-section"
      style={{
        background: `linear-gradient(160deg, #6B2C4A 0%, #4A1A30 100%)`,
        padding: "32px 24px 28px",
        color: T.textLight,
        position: "relative",
        overflow: "hidden",
        marginBottom: 24
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(200,155,94,.08)"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(200,155,94,.04)"
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {title && (
          <h1
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 28,
              lineHeight: 1.15,
              marginBottom: subtitle ? 8 : 12,
              color: T.textLight
            }}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p
            style={{
              fontSize: 14,
              opacity: 0.75,
              lineHeight: 1.6,
              color: "rgba(255,255,255,.85)"
            }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
