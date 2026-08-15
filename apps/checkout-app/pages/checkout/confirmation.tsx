import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import CheckoutConfirmation from "../../components/CheckoutConfirmation";
import { useCheckoutStore, selectTotal } from "../../store/useCheckoutStore";

// MODÜL 6 · Checkout Route - Confirmation (Onay) with Zustand

export default function CheckoutConfirmationPage() {
  const router = useRouter();
  const items = useCheckoutStore((state) => state.items);
  const total = useCheckoutStore(selectTotal);
  const cardNumber = useCheckoutStore((state) => state.cardNumber);
  const reset = useCheckoutStore((state) => state.reset);

  useEffect(() => {
    // Sepet boşsa step1'e yönlendir
    if (items.length === 0) {
      router.push("/checkout/step1");
    }
  }, [items, router]);

  const handleReset = () => {
    reset();
    router.push("/checkout/step1");
  };

  if (items.length === 0) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#0F1923",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#8BAAB8"
      }}>
        Yönlendiriliyor...
      </div>
    );
  }

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
            <span style={{ color: "#00B4D8", fontSize: "14px", fontWeight: 700 }}>✓ Tamamlandı</span>
          </div>
          
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "4px", background: "#00B4D8", borderRadius: "2px" }}></div>
            <div style={{ flex: 1, height: "4px", background: "#00B4D8", borderRadius: "2px" }}></div>
            <div style={{ flex: 1, height: "4px", background: "#00B4D8", borderRadius: "2px" }}></div>
          </div>
        </div>

        <CheckoutConfirmation
          items={items.map((i) => i.name)}
          total={total}
          cardNumber={cardNumber}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
