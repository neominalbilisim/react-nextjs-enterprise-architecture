import { useState } from "react";

// MODÜL 5 · Bu component 'exposes' ile dışarı açılmıştır — hem
// checkout-app'in kendi sayfalarında hem de shell-app (Host) içinde
// import('checkout/CheckoutWidget') ile kullanılabilir.

export default function CheckoutWidget({
  itemCount = 0,
}: {
  itemCount?: number;
}) {
  const [count, setCount] = useState(itemCount);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <p style={{ margin: "0 0 8px", color: "#8BAAB8", fontSize: 14 }}>
        Sepetinizde <strong style={{ color: "#E8F4FD" }}>{count}</strong> ürün var.
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{
          background: "#00B4D8",
          color: "#0F1923",
          fontWeight: 700,
          fontSize: 13,
          padding: "8px 16px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
        }}
      >
        Ürün Ekle
      </button>
    </div>
  );
}
