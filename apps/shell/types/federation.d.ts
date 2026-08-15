// MODÜL 5 & 6 · Federated Remote modülleri TypeScript'in bilmediği runtime
// import'lardır (webpack tarafından çözülür). Derleme zamanı hatası
// almamak için burada gevşek tip beyanları tanımlanır.

// MODÜL 5: Basit widget'lar
declare module "checkout/CheckoutWidget" {
  const CheckoutWidget: React.ComponentType<{ itemCount?: number }>;
  export default CheckoutWidget;
}

declare module "profile/ProfileWidget" {
  const ProfileWidget: React.ComponentType<{ userName?: string }>;
  export default ProfileWidget;
}

// MODÜL 6: Individual checkout components (METHOD 1 - Low Level)
declare module "checkout/CheckoutStep1" {
  interface CheckoutStep1Props {
    onNext?: (data: { items: string[]; total: number }) => void;
    initialItems?: string[];
  }
  const CheckoutStep1: React.ComponentType<CheckoutStep1Props>;
  export default CheckoutStep1;
}

declare module "checkout/CheckoutStep2" {
  interface CheckoutStep2Props {
    onNext?: (data: { cardNumber: string; name: string }) => void;
    onBack?: () => void;
    total?: number;
    items?: string[];
  }
  const CheckoutStep2: React.ComponentType<CheckoutStep2Props>;
  export default CheckoutStep2;
}

declare module "checkout/CheckoutConfirmation" {
  interface CheckoutConfirmationProps {
    orderNumber?: string;
    items?: string[];
    total?: number;
    cardNumber?: string;
    onReset?: () => void;
  }
  const CheckoutConfirmation: React.ComponentType<CheckoutConfirmationProps>;
  export default CheckoutConfirmation;
}

// MODÜL 6: Checkout Pages (METHOD 1 - Shared Routes) ⭐ RECOMMENDED
declare module "checkout/pages/CheckoutStep1Page" {
  const CheckoutStep1Page: React.ComponentType;
  export default CheckoutStep1Page;
}

declare module "checkout/pages/CheckoutStep2Page" {
  const CheckoutStep2Page: React.ComponentType;
  export default CheckoutStep2Page;
}

declare module "checkout/pages/CheckoutConfirmationPage" {
  const CheckoutConfirmationPage: React.ComponentType;
  export default CheckoutConfirmationPage;
}

// MODÜL 6: Complete flow (METHOD 2)
declare module "checkout/CheckoutFlow" {
  type CheckoutStep = "cart" | "payment" | "confirmation";
  
  interface CheckoutData {
    items: string[];
    total: number;
    cardNumber: string;
    name: string;
  }
  
  interface CheckoutFlowProps {
    initialStep?: CheckoutStep;
    initialItems?: string[];
    onComplete?: (data: CheckoutData) => void;
    onStepChange?: (step: CheckoutStep) => void;
  }
  
  const CheckoutFlow: React.ComponentType<CheckoutFlowProps>;
  export default CheckoutFlow;
}
