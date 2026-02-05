import { T } from '../../data/theme';

export function Section({ title, subtitle, children, style: s }) {
  return (
    <div style={{ marginBottom: 24, ...s }}>
      {title && (
        <h2
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 22,
            color: T.wine,
            marginBottom: subtitle ? 4 : 14,
            lineHeight: 1.2
          }}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          style={{
            fontSize: 13,
            color: T.wineLight,
            marginBottom: 16,
            lineHeight: 1.5,
            fontWeight: 500
          }}
        >
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
