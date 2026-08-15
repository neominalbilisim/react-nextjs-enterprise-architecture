import { useRouter } from "next/router";

// MODÜL 6 · Checkout Entry Point
// Bu sayfa, checkout-app'in route yapısına yönlendirir

export default function CheckoutIndexPage() {
  const router = useRouter();

  // Otomatik olarak step1'e yönlendir
  if (typeof window !== "undefined") {
    router.push("/checkout/step1");
  }

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
