import type { ReactNode } from "react";

// Build-time paylaşım örneği: bu component her app tarafından kendi
// bundle'ına dahil edilir (Module Federation'daki 'shared' singleton
// mekanizmasından farklıdır — orada TEK runtime kopyası paylaşılır).

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        background: "#1A2E3F",
        color: "#00B4D8",
        border: "1px solid #00B4D8",
      }}
    >
      {children}
    </span>
  );
}
