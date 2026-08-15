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
│   ├── CheckoutStep2.tsx      ← UI component
│   └── CheckoutConfirmation.tsx ← UI component
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
import CheckoutStep1 from "../../components/CheckoutStep1";

export default function CheckoutStep1Page() {
  const router = useRouter();

  const handleNext = (data) => {
    sessionStorage.setItem("checkout_data", JSON.stringify(data));
    router.push("/checkout/step2");  // ← Kendi routing'i
  };

  return (
    <div>
      <h1>Checkout - Step 1</h1>
      <CheckoutStep1 onNext={handleNext} />
    </div>
  );
}
```

**Özellikler:**
- ✅ Next.js routing kullanır (`useRouter`)
- ✅ sessionStorage ile state management
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
// Checkout-app has full routing logic
export default function CheckoutStep1Page() {
  const router = useRouter();
  return <CheckoutStep1 onNext={() => router.push("/checkout/step2")} />;
}
```

**Shell:**
```typescript
// Shell just imports the page
const CheckoutStep1Page = dynamic(
  () => import("checkout/pages/CheckoutStep1Page")
);
export default CheckoutStep1Page;
```

**Benefits:**
- ✅ Routing logic in checkout-app
- ✅ Can test standalone
- ✅ Shell automatically gets same behavior
- ✅ DRY principle

---

## 💡 Best Practices

### 1. Route Naming Convention

**Consistent paths:**
```
checkout-app: /checkout/step1
shell:        /checkout/step1  ← Same!
```

### 2. State Management

Use `sessionStorage` for cross-route state:
```typescript
// Save in step1
sessionStorage.setItem("checkout_data", JSON.stringify(data));

// Load in step2
const data = JSON.parse(sessionStorage.getItem("checkout_data"));
```

### 3. Error Handling

Handle missing data gracefully:
```typescript
useEffect(() => {
  const data = sessionStorage.getItem("checkout_data");
  if (!data) {
    router.push("/checkout/step1"); // Back to start
  }
}, []);
```

### 4. Type Safety

Define types for shared data:
```typescript
// types/checkout.ts
export interface CheckoutData {
  items: string[];
  total: number;
  cardNumber?: string;
  name?: string;
}
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

**Problem:** Shell ve checkout-app routing logic'i ayrıydı.

**Solution:** Checkout-app route'ları tanımlar, shell aynı route'ları kullanır.

**Result:**
- ✅ Single source of truth (checkout-app)
- ✅ DRY principle
- ✅ Standalone testing
- ✅ Consistency

**Recommendation:** Bu yapı **production'da best practice**'tir!

---

**🎉 Artık paylaşılan route mimarisi kullanıma hazır!**

**Test URL'leri:**
- Standalone: http://localhost:3001/checkout/step1
- Federated: http://localhost:3000/checkout/step1
