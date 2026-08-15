import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import CheckoutStep2 from "../../components/CheckoutStep2";
import { useCheckoutStore, selectTotal } from "../../store/useCheckoutStore";

// MODÜL 6 · Checkout Route - Step 2 (Ödeme) with Zustand

export default function CheckoutStep2Page() {
  const router = useRouter();
  const items = useCheckoutStore((state) => state.items);
  const total = useCheckoutStore(selectTotal);
  const setPaymentInfo = useCheckoutStore((state) => state.setPaymentInfo);

  useEffect(() => {
    // Sepet boşsa step1'e yönlendir
    if (items.length === 0) {
      router.push("/checkout/step1");
    }
  }, [items, router]);

  const handleNext = (paymentData: { cardNumber: string; name: string }) => {
    setPaymentInfo({
      cardNumber: paymentData.cardNumber,
      cardName: paymentData.name,
      cvv: "***",
      expiry: "**/**",
    });
    router.push("/checkout/confirmation");
  };

  const handleBack = () => {
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
        Sepet boş, yönlendiriliyor...
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
            <span style={{ color: "#8BAAB8", fontSize: "14px" }}>Adım 2/3</span>
          </div>
          
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "4px", background: "#00B4D8", borderRadius: "2px" }}></div>
            <div style={{ flex: 1, height: "4px", background: "#00B4D8", borderRadius: "2px" }}></div>
            <div style={{ flex: 1, height: "4px", background: "rgba(139, 170, 184, 0.2)", borderRadius: "2px" }}></div>
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: "#00B4D8", fontSize: "32px", marginBottom: "8px" }}>
            Ödeme Bilgileri
          </h1>
          <p style={{ color: "#8BAAB8" }}>
            Kart bilgilerinizi girin
          </p>
        </div>
        
        <CheckoutStep2 
          onNext={handleNext}
          onBack={handleBack}
          total={total}
          items={items.map((i) => i.name)}
        />
      </div>
    </div>
  );
}
