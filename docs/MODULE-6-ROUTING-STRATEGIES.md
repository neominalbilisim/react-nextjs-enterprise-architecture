# Modül 6: Micro-Frontend Routing Stratejileri

## 📚 İçindekiler

1. [Giriş](#giriş)
2. [Method 1: Component Expose](#method-1-component-expose)
3. [Method 2: Flow Expose](#method-2-flow-expose)
4. [Karşılaştırma](#karşılaştırma)
5. [Hybrid Yaklaşım](#hybrid-yaklaşım)
6. [Production Best Practices](#production-best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Giriş

Module Federation ile micro-frontend mimarisi kurarken **routing stratejisi** kritik bir karardır.
Bu modül, iki farklı yaklaşımı detaylı olarak açıklar ve ne zaman hangisinin kullanılacağını gösterir.

### Problem

Bir checkout flow'u düşünün: Sepet → Ödeme → Onay

**Sorular:**
- Shell mi routing'i kontrol etmeli, Remote mi?
- URL'ler değişmeli mi?
- Browser back button nasıl çalışmalı?
- Remote ne kadar otonom olmalı?

Bu sorulara verilen cevaplar, routing stratejinizi belirler.

---

## Method 1: Component Expose

### Konsept

Remote, **individual component'leri** expose eder. Shell, kendi routing'i ile bu component'leri yönetir.

```
┌─────────────────────────────────────┐
│          SHELL (Host)               │
│  ┌───────────────────────────────┐  │
│  │  Routing (Next.js Router)     │  │
│  └───────────────────────────────┘  │
│                                     │
│  /checkout/step1 → CheckoutStep1   │
│  /checkout/step2 → CheckoutStep2   │
│  /checkout/done  → Confirmation    │
└─────────────────────────────────────┘
         ↓ import at runtime
┌─────────────────────────────────────┐
│       CHECKOUT-APP (Remote)         │
│  exposes: {                         │
│    "./CheckoutStep1": "...",        │
│    "./CheckoutStep2": "...",        │
│    "./Confirmation": "...",         │
│  }                                  │
└─────────────────────────────────────┘
```

### Implementation

**Remote (checkout-app):**

```typescript
// components/CheckoutStep1.tsx
export default function CheckoutStep1({ onNext, initialData }) {
  const [items, setItems] = useState(initialData);
  
  return (
    <div>
      {/* UI */}
      <button onClick={() => onNext({ items })}>
        Next Step
      </button>
    </div>
  );
}

// next.config.js
exposes: {
  "./CheckoutStep1": "./components/CheckoutStep1.tsx",
  "./CheckoutStep2": "./components/CheckoutStep2.tsx",
  "./CheckoutConfirmation": "./components/CheckoutConfirmation.tsx",
}
```

**Host (shell):**

```typescript
// pages/checkout/step1.tsx
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const CheckoutStep1 = dynamic(() => import('checkout/CheckoutStep1'), {
  ssr: false
});

export default function CheckoutStep1Page() {
  const router = useRouter();
  
  const handleNext = (data) => {
    // Shell kontrolünde routing
    sessionStorage.setItem('checkout', JSON.stringify(data));
    router.push('/checkout/step2');
  };
  
  return <CheckoutStep1 onNext={handleNext} />;
}

// pages/checkout/step2.tsx
const CheckoutStep2 = dynamic(() => import('checkout/CheckoutStep2'), {
  ssr: false
});

export default function CheckoutStep2Page() {
  const router = useRouter();
  const data = JSON.parse(sessionStorage.getItem('checkout'));
  
  const handleNext = (paymentData) => {
    router.push('/checkout/confirmation');
  };
  
  return <CheckoutStep2 data={data} onNext={handleNext} />;
}
```

### Avantajlar

✅ **URL Control**: Shell tam kontrol, her adım ayrı URL
```
/checkout/step1
/checkout/step2
/checkout/confirmation
```

✅ **Browser History**: Back/Forward butonları çalışır

✅ **SEO Friendly**: Her adım ayrı sayfa, Google indexleyebilir

✅ **Deep Linking**: Kullanıcıyı direkt `/checkout/step2`'ye yönlendirebilirsiniz

✅ **Analytics**: Her sayfa için ayrı tracking

✅ **A/B Testing**: Shell level'da farklı flow'lar test edebilirsiniz

✅ **Modular**: Component'leri farklı sayfalarda tekrar kullanabilirsiniz

### Dezavantajlar

❌ **Expose Overhead**: Her component ayrı expose tanımı gerekli

❌ **Coordination**: Shell ile Remote arasında interface agreement gerekli

❌ **State Management**: Shell state'i component'ler arası taşımalı

❌ **Remote Autonomy**: Remote'un kendi flow mantığı shell'e bağımlı

### Kullanım Alanları

🎯 **İdeal Senaryolar:**
- Dashboard widget'ları
- Liste/tablo sayfaları
- Filter/search component'leri
- Shared UI components (Button, Modal, vb.)
- SEO kritik sayfalar
- Marketing sayfaları

📦 **Gerçek Örnekler:**
- **Netflix**: Film/dizi kartları, kategori widget'ları
- **Amazon**: Product listing, filters, cart summary widget
- **LinkedIn**: Job cards, profile widgets

---

## Method 2: Flow Expose

### Konsept

Remote, **complete flow'u** tek component olarak expose eder. Internal routing'i kendisi yönetir.

```
┌─────────────────────────────────────┐
│          SHELL (Host)               │
│  ┌───────────────────────────────┐  │
│  │  Routing (Next.js Router)     │  │
│  └───────────────────────────────┘  │
│                                     │
│  /checkout → CheckoutFlow           │
│              (single route)         │
└─────────────────────────────────────┘
         ↓ import at runtime
┌─────────────────────────────────────┐
│       CHECKOUT-APP (Remote)         │
│  ┌─────────────────────────────┐   │
│  │  CheckoutFlow               │   │
│  │    - Internal routing       │   │
│  │    - State management       │   │
│  │    - Step1 → Step2 → Done   │   │
│  └─────────────────────────────┘   │
│  exposes: {                         │
│    "./CheckoutFlow": "...",         │
│  }                                  │
└─────────────────────────────────────┘
```

### Implementation

**Remote (checkout-app):**

```typescript
// components/CheckoutFlow.tsx
import { useState } from 'react';
import CheckoutStep1 from './CheckoutStep1';
import CheckoutStep2 from './CheckoutStep2';
import CheckoutConfirmation from './CheckoutConfirmation';

export default function CheckoutFlow({ 
  initialItems,
  onComplete,
  onStepChange 
}) {
  const [currentStep, setCurrentStep] = useState('cart');
  const [data, setData] = useState({ items: initialItems });
  
  // Remote kendi internal routing'ini yönetir
  const handleStep1Complete = (stepData) => {
    setData(prev => ({ ...prev, ...stepData }));
    setCurrentStep('payment');
    onStepChange?.('payment');
  };
  
  const handleStep2Complete = (stepData) => {
    const finalData = { ...data, ...stepData };
    setData(finalData);
    setCurrentStep('confirmation');
    onComplete?.(finalData);
  };
  
  // Internal routing
  if (currentStep === 'cart') {
    return <CheckoutStep1 onNext={handleStep1Complete} />;
  }
  
  if (currentStep === 'payment') {
    return <CheckoutStep2 
      data={data} 
      onNext={handleStep2Complete}
      onBack={() => setCurrentStep('cart')}
    />;
  }
  
  return <CheckoutConfirmation data={data} />;
}

// next.config.js
exposes: {
  "./CheckoutFlow": "./components/CheckoutFlow.tsx",
}
```

**Host (shell):**

```typescript
// pages/checkout.tsx
import dynamic from 'next/dynamic';

const CheckoutFlow = dynamic(() => import('checkout/CheckoutFlow'), {
  ssr: false
});

export default function CheckoutPage() {
  const handleComplete = (data) => {
    console.log('Checkout completed:', data);
    // Analytics, backend call, vb.
  };
  
  const handleStepChange = (step) => {
    console.log('Current step:', step);
    // Optional: Analytics tracking
  };
  
  // Shell sadece container görevi görür
  return (
    <div>
      <h1>Checkout</h1>
      <CheckoutFlow 
        initialItems={['Product 1', 'Product 2']}
        onComplete={handleComplete}
        onStepChange={handleStepChange}
      />
    </div>
  );
}
```

### Avantajlar

✅ **Team Autonomy**: Remote tam bağımsız, kendi flow'unu yönetir

✅ **Single Expose**: Tek tanım, tüm flow'u expose eder

✅ **Encapsulation**: Internal logic tamamen Remote'ta

✅ **Complex Flows**: Multi-step, branching flow'lar için ideal

✅ **State Management**: State Remote içinde, shell'e taşmaz

✅ **Easy Integration**: Shell için plug-and-play

✅ **Testing**: Remote flow'u bağımsız test edilebilir

### Dezavantajlar

❌ **No URL Change**: Browser'da her zaman `/checkout` görünür

❌ **No Browser History**: Back button çalışmaz (veya manuel impl. gerekli)

❌ **SEO**: Tek sayfa, internal steps indexlenemez

❌ **No Deep Linking**: `/checkout/step2`'ye direkt gidemez

❌ **Shell Blindness**: Shell flow içeriğini bilmez

### Kullanım Alanları

🎯 **İdeal Senaryolar:**
- Multi-step wizard'lar (checkout, onboarding)
- Kompleks form flow'ları
- Survey/quiz uygulamaları
- Mini-app'ler (oyunlar, hesap makinesi, vb.)
- Interactive tool'lar
- Configuration wizard'ları

📦 **Gerçek Örnekler:**
- **Zalando**: Checkout wizard
- **Airbnb**: Booking flow
- **Stripe**: Payment setup wizard
- **Typeform**: Survey flow

---

## Karşılaştırma

### Side-by-Side Comparison

| Kriter | METHOD 1 | METHOD 2 |
|--------|----------|----------|
| **Routing Control** | ⭐ Shell | ⭐ Remote |
| **URL Management** | ⭐⭐⭐ Her adım ayrı | ⭐ Tek URL |
| **Browser History** | ⭐⭐⭐ Çalışır | ❌ Çalışmaz |
| **SEO** | ⭐⭐⭐ Her adım indexlenir | ⭐ Tek sayfa |
| **Deep Linking** | ⭐⭐⭐ Mümkün | ❌ Mümkün değil |
| **Team Autonomy** | ⭐ Shell'e bağımlı | ⭐⭐⭐ Tam otonom |
| **Complexity** | ⭐⭐ Orta | ⭐ Basit (Remote için) |
| **State Management** | ⭐ Shell yönetir | ⭐⭐⭐ Remote yönetir |
| **Testing** | ⭐⭐ Integration gerekli | ⭐⭐⭐ Bağımsız |
| **Expose Count** | ⭐ Çok expose | ⭐⭐⭐ Tek expose |
| **Bundle Size** | ⭐⭐ Daha fazla | ⭐⭐⭐ Daha az |

### Karar Matrisi

```
                    Basit Widget    Kompleks Flow
                    ─────────────   ─────────────
SEO Kritik          METHOD 1        METHOD 1*
SEO Önemsiz         METHOD 1        METHOD 2
                    
Team Autonomy       METHOD 1        METHOD 2
Host Control        METHOD 1        METHOD 1

URL Gerekli         METHOD 1        METHOD 1
URL Önemsiz         METHOD 1        METHOD 2

* Kompleks + SEO = Birden fazla ayrı route oluşturun
```

---

## Hybrid Yaklaşım

### Production Pattern

Gerçek dünyada **her ikisi de** kullanılır. Aynı Remote'ta farklı use case'ler için farklı yöntemler.

```javascript
// checkout-app/next.config.js
module.exports = {
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'checkout',
        exposes: {
          // METHOD 1: Basit widget'lar
          './CheckoutWidget': './components/CheckoutWidget.tsx',
          './CartSummary': './components/CartSummary.tsx',
          './OrderHistory': './components/OrderHistory.tsx',
          './ProductCard': './components/ProductCard.tsx',
          
          // METHOD 2: Kompleks flow'lar
          './CheckoutFlow': './components/CheckoutFlow.tsx',
          './OnboardingWizard': './components/OnboardingWizard.tsx',
        },
      })
    );
    return config;
  },
};
```

### Kullanım Örneği

```typescript
// Shell - Dashboard (METHOD 1 widgets)
<div className="dashboard">
  <CheckoutWidget />
  <OrderHistory limit={5} />
</div>

// Shell - Dedicated checkout page (METHOD 2 flow)
<CheckoutPage>
  <CheckoutFlow onComplete={handleComplete} />
</CheckoutPage>

// Shell - Product listing (METHOD 1 components)
<ProductGrid>
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</ProductGrid>
```

---

## Production Best Practices

### 1. API Design

**METHOD 1: Component Props**
```typescript
// ✅ Clear, predictable interface
interface CheckoutStep1Props {
  initialData?: CartData;
  onNext: (data: CartData) => void;
  onCancel?: () => void;
}

// ❌ Unclear, hard to maintain
interface CheckoutStep1Props {
  data: any;
  callbacks: any;
}
```

**METHOD 2: Flow Props**
```typescript
// ✅ Minimal, event-based
interface CheckoutFlowProps {
  initialItems?: string[];
  onComplete?: (result: CheckoutResult) => void;
  onStepChange?: (step: string) => void;
  onError?: (error: Error) => void;
}
```

### 2. State Management

**METHOD 1: Shell-managed**
```typescript
// Shell yönetir, localStorage/sessionStorage kullan
const [checkoutData, setCheckoutData] = useLocalStorage('checkout');

// Her step'te update et
<CheckoutStep1 
  data={checkoutData}
  onNext={(newData) => {
    setCheckoutData({ ...checkoutData, ...newData });
    router.push('/step2');
  }}
/>
```

**METHOD 2: Remote-managed**
```typescript
// Remote internal state kullanır
export default function CheckoutFlow() {
  const [flowState, setFlowState] = useState({
    step: 'cart',
    data: {}
  });
  
  // Shell'e sadece final result döner
  useEffect(() => {
    if (flowState.step === 'done') {
      onComplete?.(flowState.data);
    }
  }, [flowState]);
}
```

### 3. Error Handling

**METHOD 1**
```typescript
// Her step kendi error'unu handle eder
// Shell de catch edebilir
<ErrorBoundary fallback={<ErrorPage />}>
  <CheckoutStep1 
    onNext={handleNext}
    onError={(err) => showToast(err.message)}
  />
</ErrorBoundary>
```

**METHOD 2**
```typescript
// Flow internal error handling
<CheckoutFlow
  onError={(error) => {
    logError(error);
    showNotification('Bir hata oluştu');
  }}
/>
```

### 4. Analytics

**METHOD 1**
```typescript
// Her route değişiminde track
router.events.on('routeChangeComplete', (url) => {
  analytics.pageView(url);
});
```

**METHOD 2**
```typescript
// Step change callback'lerinde track
<CheckoutFlow
  onStepChange={(step) => {
    analytics.track('checkout_step', { step });
  }}
/>
```

### 5. Loading States

**METHOD 1**
```typescript
// Her component'in kendi loading'i
const Step1 = dynamic(() => import('checkout/Step1'), {
  loading: () => <Skeleton />
});
```

**METHOD 2**
```typescript
// Flow'un tek loading'i yeterli
const CheckoutFlow = dynamic(() => import('checkout/CheckoutFlow'), {
  loading: () => <CheckoutSkeleton />
});
```

---

## Troubleshooting

### Method 1 Issues

**Problem: State kayboldu (page refresh)**
```typescript
// ❌ Sadece memory'de tutma
const [data, setData] = useState({});

// ✅ Persist et
import { useLocalStorage } from '@/hooks/useLocalStorage';
const [data, setData] = useLocalStorage('checkout-data', {});
```

**Problem: Component import edilemiyor**
```typescript
// ❌ SSR mode
import CheckoutStep1 from 'checkout/CheckoutStep1';

// ✅ Dynamic import
const CheckoutStep1 = dynamic(() => import('checkout/CheckoutStep1'), {
  ssr: false
});
```

### Method 2 Issues

**Problem: Back button çalışmıyor**
```typescript
// ✅ Custom back button handling
export default function CheckoutFlow() {
  useEffect(() => {
    const handlePopState = () => {
      // Custom back logic
      if (currentStep !== 'cart') {
        setCurrentStep(getPreviousStep(currentStep));
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentStep]);
}
```

**Problem: Flow içinden çıkış yok**
```typescript
// ✅ Cancel/exit callback ekle
<CheckoutFlow
  onCancel={() => router.push('/products')}
  onComplete={() => router.push('/order-success')}
/>
```

---

## Özet

### Hızlı Karar Tablosu

| Senaryonuz | Kullanın |
|-----------|----------|
| Dashboard widget | METHOD 1 |
| SEO gerekli sayfa | METHOD 1 |
| Multi-step checkout | METHOD 2 |
| Survey/quiz | METHOD 2 |
| Liste sayfası | METHOD 1 |
| Onboarding wizard | METHOD 2 |
| Product card | METHOD 1 |
| Configuration tool | METHOD 2 |
| Filter component | METHOD 1 |
| Interactive game | METHOD 2 |

### Son Tavsiyeler

1. **Başlangıç için METHOD 1** — Daha az risk, daha fazla kontrol
2. **Kompleks flow'lar için METHOD 2** — Daha az koordinasyon, daha fazla autonomy
3. **Production'da her ikisi** — Hybrid yaklaşım, maximum flexibility
4. **Document edin** — Hangi yöntem kullanıldıysa, nedeniyle birlikte doc'layın
5. **Test edin** — Her iki yöntem için integration test yazın

---

**🎉 Modül 6 tamamlandı!**

Artık micro-frontend routing stratejilerini anlıyor ve production'da kullanabilirsiniz.

**Daha fazla bilgi:**
- [Module Federation Docs](https://webpack.js.org/concepts/module-federation/)
- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [Micro-Frontend Architecture](https://micro-frontends.org/)
