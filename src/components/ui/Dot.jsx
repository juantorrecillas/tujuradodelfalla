export function Dot({ color, size = 8 }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: 99,
        background: color,
        flexShrink: 0
      }}
    />
  );
}
