import { useState } from "react";
import CheckoutStep1 from "./CheckoutStep1";
import CheckoutStep2 from "./CheckoutStep2";
import CheckoutConfirmation from "./CheckoutConfirmation";
import { useCheckoutStore, selectTotal } from "../store/useCheckoutStore";

// MODÜL 6 · CheckoutFlow - METHOD 2 Örneği (with Zustand)
// Bu component kendi internal routing'ini yönetir.
// Shell-app sadece bu component'i render eder, içerideki adımlardan habersizdir.
// State management için Zustand kullanır.

export type CheckoutStep = "cart" | "payment" | "confirmation";

interface CheckoutFlowProps {
  initialStep?: CheckoutStep;
  initialItems?: string[];
  onComplete?: () => void;
  onStepChange?: (step: CheckoutStep) => void;
}

export default function CheckoutFlow({
  initialStep = "cart",
  initialItems,
  onComplete,
  onStepChange,
}: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(initialStep);
  
  // Zustand store'dan veri al
  const items = useCheckoutStore((state) => state.items);
  const total = useCheckoutStore(selectTotal);
  const cardNumber = useCheckoutStore((state) => state.cardNumber);
  const reset = useCheckoutStore((state) => state.reset);

  const handleStepChange = (step: CheckoutStep) => {
    setCurrentStep(step);
    if (onStepChange) {
      onStepChange(step);
    }
  };

  const handleStep1Complete = () => {
    // Zustand store zaten güncel, sadece step değiştir
    handleStepChange("payment");
  };

  const handleStep2Complete = (data: { cardNumber: string; name: string }) => {
    // Payment info zaten store'a kaydedildi (CheckoutStep2'de)
    handleStepChange("confirmation");
    
    if (onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    reset();
    handleStepChange("cart");
  };

  const handleBack = () => {
    if (currentStep === "payment") {
      handleStepChange("cart");
    }
  };

  return (
    <div style={{
      minHeight: "500px",
      background: "#0F1923",
      color: "#E8F4FD",
      padding: "20px",
      borderRadius: "12px",
    }}>
      {/* Progress Indicator */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "32px",
        padding: "0 20px",
      }}>
        {[
          { key: "cart", label: "Sepet", icon: "🛒" },
          { key: "payment", label: "Ödeme", icon: "💳" },
          { key: "confirmation", label: "Onay", icon: "✅" },
        ].map((step, index) => (
          <div key={step.key} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: currentStep === step.key
                    ? "#00B4D8"
                    : index < ["cart", "payment", "confirmation"].indexOf(currentStep)
                    ? "rgba(0, 180, 216, 0.3)"
                    : "rgba(139, 170, 184, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  transition: "all 0.3s ease",
                }}
              >
                {step.icon}
              </div>
              <span
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: currentStep === step.key ? "#00B4D8" : "#8BAAB8",
                  fontWeight: currentStep === step.key ? 700 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
            {index < 2 && (
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  background: index < ["cart", "payment", "confirmation"].indexOf(currentStep)
                    ? "rgba(0, 180, 216, 0.3)"
                    : "rgba(139, 170, 184, 0.2)",
                  margin: "0 8px",
                  maxWidth: "80px",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {currentStep === "cart" && (
          <CheckoutStep1
            onNext={handleStep1Complete}
            initialItems={initialItems}
          />
        )}

        {currentStep === "payment" && (
          <CheckoutStep2
            onNext={handleStep2Complete}
            onBack={handleBack}
            total={total}
            items={items.map((i) => i.name)}
          />
        )}

        {currentStep === "confirmation" && (
          <CheckoutConfirmation
            items={items.map((i) => i.name)}
            total={total}
            cardNumber={cardNumber}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Info Badge */}
      <div style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "rgba(0, 180, 216, 0.15)",
        padding: "6px 12px",
        borderRadius: "4px",
        fontSize: "11px",
        color: "#00B4D8",
        fontWeight: 700,
        letterSpacing: "0.5px",
      }}>
        METHOD 2: INTERNAL ROUTING
      </div>
    </div>
  );
}
