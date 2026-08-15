# 🎯 Shared Routes Architecture - Best Practice

Bu dokümantasyon, **checkout-app**'te tanımlanan route'ların **shell** tarafından aynı şekilde kullanılmasını açıklar.

---

## 🏗️ Mimari

### Prensip

> **Remote (checkout-app) kendi route'larını tanımlar.**  
> **Host (shell) aynı route'ları kullanır.**

Bu yaklaşım:
- ✅ DRY (Don't Repeat Yourself)
- ✅ Consistency (Aynı route yapısı)
- ✅ Standalone mode (checkout-app bağımsız çalışır)
- ✅ Federated mode (shell içinde de çalışır)

---

## 📁 Dosya Yapısı

### Checkout-App (Remote)

```
apps/checkout-app/
├── pages/
│   ├── checkout/
│   │   ├── step1.tsx          ← Route tanımı burada
│   │   ├── step2.tsx          ← Route tanımı burada
│   │   └── confirmation.tsx   ← Route tanımı burada
│   └── index.tsx
├── components/
│   ├── CheckoutStep1.tsx      ← UI component
│   ├── CheckoutStep2.tsx      ← UI component (React Hook Form + Zod)
│   └── CheckoutConfirmation.tsx ← UI component
├── store/
│   └── useCheckoutStore.ts    ← Zustand store
└── next.config.js             ← Pages expose edilir
```

### Shell (Host)

```
apps/shell/
├── pages/
│   ├── checkout/
│   │   ├── index.tsx          ← /checkout → /checkout/step1
│   │   ├── step1.tsx          ← checkout-app page'ini import eder
│   │   ├── step2.tsx          ← checkout-app page'ini import eder
│   │   └── confirmation.tsx   ← checkout-app page'ini import eder
│   └── dashboard.tsx
└── types/
    └── federation.d.ts        ← Type declarations
```

---

## 🔧 Implementation

### 1️⃣ Checkout-App: Route Tanımları

#### `apps/checkout-app/pages/checkout/step1.tsx`

```typescript
import { useRouter } from "next/router";
import { useEffect } from "react";
import CheckoutStep1 from "../../components/CheckoutStep1";
import { useCheckoutStore } from "../../store/useCheckoutStore";

export default function CheckoutStep1Page() {
  const router = useRouter();
  const items = useCheckoutStore((state) => state.items);

  const handleNext = () => {
    router.push("/checkout/step2");  // ← Kendi routing'i
  };

  // Eğer sepet boşsa ilk sayfaya dön (opsiyonel)
  useEffect(() => {
    if (items.length === 0) {
      // İlk kez geliyorsa, default items'ı ekle
      // veya başka bir sayfaya yönlendir
    }
  }, [items]);

  return (
    <div>
      <CheckoutStep1 onNext={handleNext} />
    </div>
  );
}
```

**Özellikler:**
- ✅ Next.js routing kullanır (`useRouter`)
- ✅ **Zustand store** ile centralized state management
- ✅ React Hook Form + Zod validation
- ✅ Standalone çalışabilir (http://localhost:3001/checkout/step1)

### 2️⃣ Checkout-App: Expose Configuration

#### `apps/checkout-app/next.config.js`

```javascript
exposes: {
  // Page components - Shell bunları import eder
  "./pages/CheckoutStep1Page": "./pages/checkout/step1.tsx",
  "./pages/CheckoutStep2Page": "./pages/checkout/step2.tsx",
  "./pages/CheckoutConfirmationPage": "./pages/checkout/confirmation.tsx",
}
```

### 3️⃣ Shell: Import Remote Pages

#### `apps/shell/pages/checkout/step1.tsx`

```typescript
import dynamic from "next/dynamic";

// checkout-app'in page'ini import et
const CheckoutStep1Page = dynamic(
  () => import("checkout/pages/CheckoutStep1Page"),
  { ssr: false }
);

// Shell'in route'u aynı
export default CheckoutStep1Page;
```

**Result:**
- Shell URL: `http://localhost:3000/checkout/step1`
- Checkout-App URL: `http://localhost:3001/checkout/step1`
- **Aynı component, aynı davranış! ✅**

---

## 🎯 Route Mapping

| Shell Route | Checkout-App Route | Component |
|-------------|-------------------|-----------|
| `/checkout` | `/checkout/step1` | Redirect |
| `/checkout/step1` | `/checkout/step1` | CheckoutStep1Page |
| `/checkout/step2` | `/checkout/step2` | CheckoutStep2Page |
| `/checkout/confirmation` | `/checkout/confirmation` | CheckoutConfirmationPage |

---

## ✨ Avantajlar

### 1. DRY (Don't Repeat Yourself)

❌ **Eski Yöntem (Tekrar):**
```typescript
// Shell'de ayrı logic
const handleNext = () => router.push("/step2");

// Checkout-app'te ayrı logic (farklı!)
const handleNext = () => console.log("next");
```

✅ **Yeni Yöntem (Shared):**
```typescript
// Checkout-app'te tanımla
const handleNext = () => router.push("/checkout/step2");

// Shell sadece import et - logic aynı!
```

### 2. Consistency

Her iki modda da **aynı davranış**:
- Aynı routing logic
- Aynı state management
- Aynı error handling

### 3. Standalone Mode

Checkout-app bağımsız çalışır:
```bash
npm run dev:checkout
# http://localhost:3001/checkout/step1 ✅
```

### 4. Development Experience

Tek bir yerde geliştirme:
- Checkout-app'te geliştir
- Test et (standalone)
- Shell'de otomatik çalışır

---

## 🔄 Routing Flow

### Standalone Mode (checkout-app: 3001)

```
User → http://localhost:3001/checkout/step1
       ↓
Next.js Router (checkout-app)
       ↓
pages/checkout/step1.tsx
       ↓
CheckoutStep1 component
       ↓
User clicks "Next"
       ↓
router.push("/checkout/step2")
       ↓
pages/checkout/step2.tsx
```

### Federated Mode (shell: 3000)

```
User → http://localhost:3000/checkout/step1
       ↓
Next.js Router (shell)
       ↓
pages/checkout/step1.tsx (shell)
       ↓
dynamic import("checkout/pages/CheckoutStep1Page")
       ↓
Webpack Module Federation
       ↓
pages/checkout/step1.tsx (checkout-app) ← Aynı component!
       ↓
CheckoutStep1 component
       ↓
User clicks "Next"
       ↓
router.push("/checkout/step2")
       ↓
Shell router → /checkout/step2
       ↓
Same flow repeats...
```

---

## 📝 Type Declarations

### `apps/shell/types/federation.d.ts`

```typescript
// Page components
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
```

---

## 🧪 Testing

### Test Standalone Mode

```bash
# Terminal 1: Start checkout-app
npm run dev:checkout

# Browser: Test routes
http://localhost:3001/checkout/step1
http://localhost:3001/checkout/step2
http://localhost:3001/checkout/confirmation
```

### Test Federated Mode

```bash
# Terminal 1: Start checkout-app
npm run dev:checkout

# Terminal 2: Start shell
npm run dev:shell

# Browser: Test routes (same paths!)
http://localhost:3000/checkout/step1
http://localhost:3000/checkout/step2
http://localhost:3000/checkout/confirmation
```

---

## 🆚 Comparison: Old vs New

### Old Method (checkout-method1.tsx)

**Shell:**
```typescript
// Shell manages everything
const [step, setStep] = useState("step1");

if (step === "step1") {
  return <CheckoutStep1 onNext={() => setStep("step2")} />;
}
```

**Problems:**
- ❌ Routing logic in shell
- ❌ State management in shell
- ❌ checkout-app components don't have routing
- ❌ Can't test checkout-app standalone with routing

### New Method (Shared Routes) ⭐

**Checkout-App:**
```typescript
// Checkout-app has full routing logic + state management
import { useCheckoutStore } from "../../store/useCheckoutStore";

export default function CheckoutStep1Page() {
  const router = useRouter();
  const items = useCheckoutStore((state) => state.items);
  
  return (
    <CheckoutStep1 
      onNext={() => router.push("/checkout/step2")} 
    />
  );
}
```

**Shell:**
```typescript
// Shell just imports the page
const CheckoutStep1Page = dynamic(
  () => import("checkout/pages/CheckoutStep1Page"),
  { ssr: false }
);
export default CheckoutStep1Page;
```

**Benefits:**
- ✅ Routing logic in checkout-app
- ✅ Zustand store for state management
- ✅ React Hook Form + Zod validation
- ✅ Can test standalone
- ✅ Shell automatically gets same behavior
- ✅ DRY principle
- ✅ Type-safe throughout

---

## 💡 Best Practices

### 1. Route Naming Convention

**Consistent paths:**
```
checkout-app: /checkout/step1
shell:        /checkout/step1  ← Same!
```

### 2. State Management

**Use Zustand Store** for centralized state management:

```typescript
// apps/checkout-app/store/useCheckoutStore.ts
import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutStore {
  // State
  items: CartItem[];
  cardNumber: string;
  cardName: string;
  cvv: string;
  expiry: string;
  
  // Actions
  addItem: (name: string, price?: number) => void;
  removeItem: (id: string) => void;
  setPaymentInfo: (data: PaymentData) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  items: [],
  cardNumber: "",
  cardName: "",
  cvv: "",
  expiry: "",
  
  addItem: (name, price = 500) => {
    // Implementation...
  },
  
  setPaymentInfo: (data) => {
    set({
      cardNumber: data.cardNumber,
      cardName: data.cardName,
      cvv: data.cvv,
      expiry: data.expiry,
    });
  },
  
  reset: () => {
    set({
      items: [],
      cardNumber: "",
      cardName: "",
      cvv: "",
      expiry: "",
    });
  },
}));

// Selectors for computed values
export const selectTotal = (state: CheckoutStore) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

**Usage in components:**
```typescript
// Any component can access the store
const items = useCheckoutStore((state) => state.items);
const addItem = useCheckoutStore((state) => state.addItem);
const total = useCheckoutStore(selectTotal);
```

**Avantajları:**
- ✅ Centralized state (tüm pages erişebilir)
- ✅ No props drilling
- ✅ Optimized re-renders (selector pattern)
- ✅ Type-safe
- ✅ Dev tools support

### 3. Form Validation

**Use React Hook Form + Zod** for type-safe validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(19, "Kart numarası 16 haneli olmalıdır")
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "Geçerli bir kart numarası giriniz"),
  cardName: z
    .string()
    .min(3, "İsim en az 3 karakter olmalıdır")
    .regex(/^[A-ZÇĞİÖŞÜ\s]+$/, "Sadece büyük harfler kullanınız"),
  cvv: z
    .string()
    .length(3, "CVV 3 haneli olmalıdır")
    .regex(/^\d{3}$/, "Sadece rakam giriniz"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY formatında giriniz"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

// Component
export default function CheckoutStep2() {
  const setPaymentInfo = useCheckoutStore((state) => state.setPaymentInfo);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  });

  const onSubmit = (data: PaymentFormData) => {
    setPaymentInfo(data);  // Zustand'a kaydet
    router.push("/checkout/confirmation");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("cardNumber")} />
      {errors.cardNumber && <p>{errors.cardNumber.message}</p>}
      
      <button type="submit" disabled={!isValid}>
        Devam Et
      </button>
    </form>
  );
}
```

### 4. Error Handling

Handle missing data gracefully using Zustand:
```typescript
useEffect(() => {
  const items = useCheckoutStore.getState().items;
  if (items.length === 0) {
    router.push("/checkout/step1"); // Back to start
  }
}, []);
```

### 5. Type Safety

Zustand store is already type-safe:
```typescript
// TypeScript infers all types automatically
const items = useCheckoutStore((state) => state.items); // CartItem[]
const total = useCheckoutStore(selectTotal); // number
```

---

## 🚀 Migration Guide

### From Old to New

1. **Create route pages in checkout-app:**
   ```bash
   mkdir apps/checkout-app/pages/checkout
   touch apps/checkout-app/pages/checkout/step1.tsx
   ```

2. **Expose pages in next.config.js:**
   ```javascript
   exposes: {
     "./pages/CheckoutStep1Page": "./pages/checkout/step1.tsx",
   }
   ```

3. **Update shell to import pages:**
   ```typescript
   const Page = dynamic(() => import("checkout/pages/CheckoutStep1Page"));
   ```

4. **Update type declarations:**
   ```typescript
   declare module "checkout/pages/CheckoutStep1Page" { ... }
   ```

5. **Test both modes:**
   - Standalone: http://localhost:3001/checkout/step1
   - Federated: http://localhost:3000/checkout/step1

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│         CHECKOUT-APP (Remote: 3001)             │
│                                                 │
│  pages/checkout/                                │
│  ├── step1.tsx    ← Route Definition           │
│  ├── step2.tsx    ← Route Definition           │
│  └── confirmation.tsx                           │
│                                                 │
│  Standalone: http://localhost:3001/checkout/   │
│                                                 │
│  Exposes:                                       │
│  ├── ./pages/CheckoutStep1Page                 │
│  ├── ./pages/CheckoutStep2Page                 │
│  └── ./pages/CheckoutConfirmationPage          │
└─────────────────────────────────────────────────┘
                      ↓
            Module Federation
                      ↓
┌─────────────────────────────────────────────────┐
│           SHELL (Host: 3000)                    │
│                                                 │
│  pages/checkout/                                │
│  ├── step1.tsx    ← Imports remote page        │
│  ├── step2.tsx    ← Imports remote page        │
│  └── confirmation.tsx                           │
│                                                 │
│  Federated: http://localhost:3000/checkout/    │
│                                                 │
│  Same URLs, Same Behavior! ✅                   │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist

### Setup Checklist

- [x] Create pages in checkout-app
- [x] Expose pages in next.config.js
- [x] Create shell pages that import remote pages
- [x] Add type declarations
- [x] Update dashboard links
- [x] Test standalone mode
- [x] Test federated mode
- [x] Document architecture

---

## 🎓 Summary

**Problem:** Shell ve checkout-app routing logic'i ayrıydı, state management tutarlı değildi.

**Solution:** 
1. Checkout-app route'ları tanımlar, shell aynı route'ları kullanır
2. Zustand store ile centralized state management
3. React Hook Form + Zod ile type-safe validation

**Result:**
- ✅ Single source of truth (checkout-app)
- ✅ DRY principle
- ✅ Standalone testing
- ✅ Consistency
- ✅ Centralized state (Zustand)
- ✅ Type-safe validation (Zod)
- ✅ Performant forms (React Hook Form)

**Tech Stack:**
- 🎯 Module Federation (runtime code sharing)
- 🐻 Zustand (state management)
- 📋 React Hook Form (form handling)
- ✅ Zod (schema validation)
- 🎨 TypeScript (type safety)

**Recommendation:** Bu yapı **production'da best practice**'tir!

---

**🎉 Artık paylaşılan route mimarisi kullanıma hazır!**

**Test URL'leri:**
- Standalone: http://localhost:3001/checkout/step1
- Federated: http://localhost:3000/checkout/step1
