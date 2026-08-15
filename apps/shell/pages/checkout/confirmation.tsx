import dynamic from "next/dynamic";
import CheckoutErrorBoundary, {
  withRemoteLoadError,
} from "@/components/CheckoutErrorBoundary";

// MODÜL 6 · Shell Route: /checkout/confirmation
// checkout-app'in aynı route'unu kullanır (METHOD 1 - Shared Routes)

const CheckoutConfirmationPage = dynamic(
  withRemoteLoadError(() => import("checkout/pages/CheckoutConfirmationPage")),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: "100vh",
          background: "#0F1923",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8BAAB8",
        }}
      >
        Checkout yükleniyor...
      </div>
    ),
  }
);

export default function ShellCheckoutConfirmationPage() {
  return (
    <CheckoutErrorBoundary>
      <CheckoutConfirmationPage />
    </CheckoutErrorBoundary>
  );
}
