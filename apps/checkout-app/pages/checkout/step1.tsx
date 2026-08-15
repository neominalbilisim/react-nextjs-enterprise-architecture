import { useRouter } from "next/router";
import Link from "next/link";
import CheckoutStep1 from "../../components/CheckoutStep1";
import { useCheckoutStore, selectItemCount } from "../../store/useCheckoutStore";

// MODÜL 6 · Checkout Route - Step 1 (Sepet) with Zustand

export default function CheckoutStep1Page() {
  const router = useRouter();
  const itemCount = useCheckoutStore(selectItemCount);

  const handleNext = () => {
    // Zustand store kullanıyoruz, sessionStorage'a gerek yok
    router.push("/checkout/step2");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#0F1923", 
      padding: "40px 20px" 
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <Link href="/" style={{ color: "#8BAAB8", textDecoration: "none", fontSize: "14px" }}>
              ← Ana Sayfa
            </Link>
            <span style={{ color: "#8BAAB8", fontSize: "14px" }}>Adım 1/3</span>
          </div>
          
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "4px", background: "#00B4D8", borderRadius: "2px" }}></div>
            <div style={{ flex: 1, height: "4px", background: "rgba(139, 170, 184, 0.2)", borderRadius: "2px" }}></div>
            <div style={{ flex: 1, height: "4px", background: "rgba(139, 170, 184, 0.2)", borderRadius: "2px" }}></div>
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: "#00B4D8", fontSize: "32px", marginBottom: "8px" }}>
            Sepetiniz
          </h1>
          <p style={{ color: "#8BAAB8" }}>
            Ürünlerinizi kontrol edin ve ödemeye geçin
          </p>
        </div>
        
        <CheckoutStep1 
          onNext={handleNext}
          initialItems={["Laptop", "Mouse", "Keyboard"]}
        />
        
        <button
          onClick={handleCancel}
          style={{
            marginTop: "20px",
            background: "transparent",
            border: "1px solid #8BAAB8",
            color: "#8BAAB8",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          İptal Et
        </button>
      </div>
    </div>
  );
}
