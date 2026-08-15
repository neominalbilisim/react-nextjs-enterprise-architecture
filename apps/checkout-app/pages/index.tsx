import Link from "next/link";
import CheckoutWidget from "../components/CheckoutWidget";

// Bu sayfa, checkout-app'in KENDİ başına (shell-app olmadan) da
// çalışabildiğini gösterir — bağımsız geliştirme ve test için önemlidir.

export default function CheckoutStandalonePage() {
  return (
    <main style={{ 
      padding: "40px", 
      fontFamily: "sans-serif", 
      background: "#0F1923", 
      minHeight: "100vh", 
      color: "#E8F4FD",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ 
          color: "#00B4D8", 
          fontWeight: 700, 
          fontSize: "13px", 
          letterSpacing: "2px",
          marginBottom: "8px"
        }}>
          CHECKOUT-APP · STANDALONE
        </p>
        <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>
          Checkout Remote App
        </h1>
        <p style={{ color: "#8BAAB8", fontSize: "16px" }}>
          Bu uygulama shell-app olmadan bağımsız çalışabilir.
        </p>
      </div>

      {/* Widget Demo */}
      <div style={{ 
        background: "rgba(0, 180, 216, 0.1)", 
        padding: "24px", 
        borderRadius: "12px",
        marginBottom: "40px"
      }}>
        <h2 style={{ 
          color: "#00B4D8", 
          fontSize: "20px", 
          marginBottom: "16px" 
        }}>
          Widget Demo
        </h2>
        <CheckoutWidget itemCount={2} />
      </div>

      {/* Checkout Flow Navigation */}
      <div>
        <h2 style={{ 
          color: "#00B4D8", 
          fontSize: "24px", 
          marginBottom: "24px" 
        }}>
          Checkout Flow
        </h2>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px"
        }}>
          {/* Step 1 */}
          <Link href="/checkout/step1" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(0, 180, 216, 0.1)",
              border: "2px solid rgba(0, 180, 216, 0.3)",
              padding: "24px",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 180, 216, 0.6)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 180, 216, 0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              <div style={{ 
                fontSize: "40px", 
                marginBottom: "12px" 
              }}>
                🛒
              </div>
              <h3 style={{ 
                color: "#00B4D8", 
                fontSize: "20px", 
                marginBottom: "8px" 
              }}>
                Step 1: Sepet
              </h3>
              <p style={{ 
                color: "#8BAAB8", 
                fontSize: "14px",
                marginBottom: "12px"
              }}>
                Sepetinizi görüntüleyin ve ürün ekleyin/çıkarın
              </p>
              <div style={{ 
                color: "#00B4D8", 
                fontSize: "14px",
                fontWeight: 700
              }}>
                Başla →
              </div>
            </div>
          </Link>

          {/* Step 2 */}
          <Link href="/checkout/step2" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(0, 180, 216, 0.1)",
              border: "2px solid rgba(0, 180, 216, 0.3)",
              padding: "24px",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 180, 216, 0.6)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 180, 216, 0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              <div style={{ 
                fontSize: "40px", 
                marginBottom: "12px" 
              }}>
                💳
              </div>
              <h3 style={{ 
                color: "#00B4D8", 
                fontSize: "20px", 
                marginBottom: "8px" 
              }}>
                Step 2: Ödeme
              </h3>
              <p style={{ 
                color: "#8BAAB8", 
                fontSize: "14px",
                marginBottom: "12px"
              }}>
                Ödeme bilgilerinizi girin
              </p>
              <div style={{ 
                color: "#00B4D8", 
                fontSize: "14px",
                fontWeight: 700
              }}>
                Git →
              </div>
            </div>
          </Link>

          {/* Confirmation */}
          <Link href="/checkout/confirmation" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(0, 180, 216, 0.1)",
              border: "2px solid rgba(0, 180, 216, 0.3)",
              padding: "24px",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 180, 216, 0.6)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 180, 216, 0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              <div style={{ 
                fontSize: "40px", 
                marginBottom: "12px" 
              }}>
                ✅
              </div>
              <h3 style={{ 
                color: "#00B4D8", 
                fontSize: "20px", 
                marginBottom: "8px" 
              }}>
                Step 3: Onay
              </h3>
              <p style={{ 
                color: "#8BAAB8", 
                fontSize: "14px",
                marginBottom: "12px"
              }}>
                Sipariş onay sayfası
              </p>
              <div style={{ 
                color: "#00B4D8", 
                fontSize: "14px",
                fontWeight: 700
              }}>
                Görüntüle →
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Info */}
      <div style={{
        marginTop: "40px",
        padding: "20px",
        background: "rgba(0, 180, 216, 0.05)",
        border: "1px solid rgba(0, 180, 216, 0.2)",
        borderRadius: "8px"
      }}>
        <p style={{ color: "#8BAAB8", fontSize: "14px", margin: 0 }}>
          💡 Bu sayfa checkout-app'in bağımsız çalıştığını gösterir. 
          Shell-app (http://localhost:3000) içinde de aynı route'lar çalışır!
        </p>
      </div>
    </main>
  );
}
