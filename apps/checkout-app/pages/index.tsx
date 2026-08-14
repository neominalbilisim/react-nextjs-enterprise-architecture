import CheckoutWidget from "../components/CheckoutWidget";

// Bu sayfa, checkout-app'in KENDİ başına (shell-app olmadan) da
// çalışabildiğini gösterir — bağımsız geliştirme ve test için önemlidir.

export default function CheckoutStandalonePage() {
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif", background: "#0F1923", minHeight: "100vh", color: "#E8F4FD" }}>
      <p style={{ color: "#00B4D8", fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>
        CHECKOUT-APP · STANDALONE
      </p>
      <h1>Checkout Remote — Bağımsız Çalışma Modu</h1>
      <div style={{ marginTop: 24 }}>
        <CheckoutWidget itemCount={2} />
      </div>
    </main>
  );
}
