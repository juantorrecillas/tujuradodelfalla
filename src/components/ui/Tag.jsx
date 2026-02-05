import { T } from '../../data/theme';

export function Tag({ children, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: T.rPill,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.2,
        background: color + "15",
        color
      }}
    >
      {children}
    </span>
  );
}
