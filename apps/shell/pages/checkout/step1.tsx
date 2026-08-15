import dynamic from "next/dynamic";

// MODÜL 6 · Shell Route: /checkout/step1
// checkout-app'in aynı route'unu kullanır (METHOD 1 - Shared Routes)

const CheckoutStep1Page = dynamic(
  () => import("checkout/pages/CheckoutStep1Page"),
  {
    ssr: false,
    loading: () => (
      <div style={{
        minHeight: "100vh",
        background: "#0F1923",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#8BAAB8"
      }}>
        Checkout yükleniyor...
      </div>
    ),
  }
);

export default CheckoutStep1Page;
