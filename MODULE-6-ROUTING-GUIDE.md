# 🚀 Modül 6: Micro-Frontend Routing Kullanım Kılavuzu

Bu dosya, yeni eklenen checkout routing özelliğinin **nasıl kullanılacağını** adım adım açıklar.

---

## 📋 Hızlı Başlangıç

### 1️⃣ Uygulamaları Başlatın

```bash
# Tüm uygulamaları tek komutla başlat
npm run dev
```

Ya da ayrı ayrı:

```bash
# Terminal 1 - Host (Shell)
npm run dev:shell

# Terminal 2 - Remote (Checkout-app)
npm run dev:checkout

# Terminal 3 - Remote (Profile-app)
npm run dev:profile
```

### 2️⃣ Cookie Ekleyin (Authentication)

Tarayıcınızı açın ve Console'a (F12) şunu yazın:

```javascript
document.cookie = "session_token=test_token; path=/";
```

Sonra sayfayı yenileyin (F5).

---

## 🛣️ Route Haritası

### Ana Sayfalar

| URL | Açıklama | Yöntem |
|-----|----------|--------|
| `http://localhost:3000/` | Ana sayfa | - |
| `http://localhost:3000/dashboard` | Dashboard (widget'lar) | Method 1 |
| `http://localhost:3000/checkout` | **Checkout Flow** | **Method 2** |
| `http://localhost:3000/checkout-method1` | **Checkout (Individual)** | **Method 1** |

---

## 🎯 Method 2: CheckoutFlow Kullanımı

### URL
```
http://localhost:3000/checkout
```

### Nasıl Çalışır?

1. **Tarayıcıda açın:** `http://localhost:3000/checkout`

2. **Adım 1 - Sepet:**
   - Ürün ekleyin/çıkarın
   - Toplamı görün
   - "Ödemeye Geç" butonuna tıklayın

3. **Adım 2 - Ödeme:**
   - Kart numarası: `1234 5678 9012 3456` (örnek)
   - İsim: `AHMET YILMAZ`
   - Son kullanma: `12/25`
   - CVV: `123`
   - "Ödemeyi Tamamla" butonuna tıklayın

4. **Adım 3 - Onay:**
   - Sipariş detaylarını görün
   - "Yeni Sipariş Ver" ile başa dönün

### Özellikler

✅ **URL değişmez** — Her zaman `/checkout` görünür
✅ **Remote kontrolünde** — checkout-app kendi routing'ini yönetir
✅ **Progress bar** — Hangi adımda olduğunuzu gösterir
✅ **Internal state** — Browser back butonu çalışmaz (flow içinde)

### Host'tan Kullanım (Shell)

```typescript
// apps/shell/pages/checkout.tsx

import dynamic from "next/dynamic";

const CheckoutFlow = dynamic(() => import("checkout/CheckoutFlow"), {
  ssr: false,
  loading: () => <div>Yükleniyor...</div>
});

export default function CheckoutPage() {
  return (
    <CheckoutFlow 
      initialItems={["Laptop", "Mouse", "Keyboard"]}
      onComplete={(data) => {
        console.log("Sipariş tamamlandı:", data);
        // Analytics, backend call, vb.
      }}
      onStepChange={(step) => {
        console.log("Adım değişti:", step);
      }}
    />
  );
}
```

### Dashboard'dan Link

```typescript
// apps/shell/pages/dashboard.tsx

import Link from "next/link";

<Link href="/checkout">
  <div className="card">
    Method 2: CheckoutFlow
  </div>
</Link>
```

### Programmatik Navigasyon

```typescript
import { useRouter } from "next/router";

const router = useRouter();

// Kullanıcıyı checkout'a yönlendir
const handleCheckout = () => {
  router.push("/checkout");
};

<button onClick={handleCheckout}>
  Alışverişi Tamamla
</button>
```

---

## 📦 Method 1: Individual Components Kullanımı

### URL
```
http://localhost:3000/checkout-method1
```

### Nasıl Çalışır?

1. **Tarayıcıda açın:** `http://localhost:3000/checkout-method1`

2. **Aynı flow ama farklı kontrol:**
   - Shell routing'i yönetir
   - Her adım shell'in kontrolünde
   - State shell tarafından yönetilir

### Özellikler

✅ **Shell kontrolünde** — Host routing'i yönetir
✅ **Progress indicator** — Shell'in kendi UI'ı
✅ **State management** — Shell state'i tutar
✅ **Modüler** — Her component ayrı import edilir

### Host'tan Kullanım (Shell)

```typescript
// apps/shell/pages/checkout-method1.tsx

import dynamic from "next/dynamic";
import { useState } from "react";

const CheckoutStep1 = dynamic(() => import("checkout/CheckoutStep1"), {
  ssr: false
});

const CheckoutStep2 = dynamic(() => import("checkout/CheckoutStep2"), {
  ssr: false
});

export default function CheckoutMethod1Page() {
  const [step, setStep] = useState("step1");
  const [data, setData] = useState({});

  if (step === "step1") {
    return (
      <CheckoutStep1 
        onNext={(stepData) => {
          setData(stepData);
          setStep("step2");
        }}
      />
    );
  }

  if (step === "step2") {
    return (
      <CheckoutStep2
        data={data}
        onNext={(stepData) => {
          setData({ ...data, ...stepData });
          setStep("confirmation");
        }}
      />
    );
  }

  // ... confirmation
}
```

### Ayrı Route'lar Oluşturma (Alternatif)

```typescript
// apps/shell/pages/checkout/step1.tsx
const CheckoutStep1 = dynamic(() => import("checkout/CheckoutStep1"));

export default function Step1Page() {
  const router = useRouter();
  
  return (
    <CheckoutStep1 
      onNext={(data) => {
        sessionStorage.setItem("checkout", JSON.stringify(data));
        router.push("/checkout/step2");
      }}
    />
  );
}

// apps/shell/pages/checkout/step2.tsx
const CheckoutStep2 = dynamic(() => import("checkout/CheckoutStep2"));

export default function Step2Page() {
  const data = JSON.parse(sessionStorage.getItem("checkout"));
  
  return (
    <CheckoutStep2 
      data={data}
      onNext={() => router.push("/checkout/confirmation")}
    />
  );
}
```

---

## 🎨 Dashboard Widget Kullanımı

### URL
```
http://localhost:3000/dashboard
```

### Widget'ları Görüntüleme

Dashboard'da iki tür örnek var:

1. **Method 1 Widget'ları:**
   - CheckoutWidget (basit sayaç)
   - ProfileWidget (kullanıcı bilgisi)
   - CheckoutStep1 (sepet component'i)

2. **Method 2'ye Geçiş Linkleri:**
   - "Method 2: CheckoutFlow" kartı
   - "Method 1: Individual Components" kartı

### Kendi Widget'inizi Eklemek

```typescript
// apps/shell/components/MyComponent.tsx

import dynamic from "next/dynamic";

const MyWidget = dynamic(() => import("checkout/MyExposedWidget"), {
  ssr: false,
  loading: () => <div>Yükleniyor...</div>
});

export default function MyComponent() {
  return (
    <div className="card">
      <h3>Özel Widget</h3>
      <MyWidget />
    </div>
  );
}
```

---

## 🔗 Programmatik Route Yönetimi

### Next.js Router ile Yönlendirme

```typescript
import { useRouter } from "next/router";

export default function ProductPage() {
  const router = useRouter();
  
  const handleAddToCart = () => {
    // Ürünü sepete ekle
    addToCart(product);
    
    // Checkout'a yönlendir
    router.push("/checkout");
  };
  
  const handleQuickCheckout = () => {
    // Direkt Method 1'e git
    router.push("/checkout-method1");
  };
  
  return (
    <div>
      <button onClick={handleAddToCart}>
        Sepete Ekle ve Öde
      </button>
      <button onClick={handleQuickCheckout}>
        Hemen Al
      </button>
    </div>
  );
}
```

### Link Component ile

```typescript
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <Link href="/checkout">
        <a className="btn">Checkout (Method 2)</a>
      </Link>
      
      <Link href="/checkout-method1">
        <a className="btn">Checkout (Method 1)</a>
      </Link>
      
      <Link href="/dashboard">
        <a className="btn">Dashboard</a>
      </Link>
    </nav>
  );
}
```

### Query Parameters ile

```typescript
// Başlangıç step'ini belirle
router.push("/checkout?step=payment");

// Ya da
<Link href="/checkout?items=3">
  Checkout
</Link>
```

---

## 📊 Event Handling ve Callbacks

### Method 2: Flow Events

```typescript
<CheckoutFlow
  // Step değiştiğinde
  onStepChange={(step) => {
    console.log("Mevcut adım:", step);
    analytics.track("checkout_step", { step });
  }}
  
  // Tamamlandığında
  onComplete={(data) => {
    console.log("Sipariş:", data);
    
    // Backend'e gönder
    fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(data)
    });
    
    // Success sayfasına yönlendir
    router.push("/order-success");
  }}
  
  // Hata olduğunda
  onError={(error) => {
    console.error("Hata:", error);
    toast.error(error.message);
  }}
/>
```

### Method 1: Component Events

```typescript
<CheckoutStep1
  onNext={(data) => {
    // Analytics
    analytics.track("step1_completed", { items: data.items.length });
    
    // State update
    setCheckoutData(data);
    
    // Next step
    setCurrentStep("step2");
  }}
  
  onCancel={() => {
    // İptal edildi
    router.push("/cart");
  }}
/>
```

---

## 🔧 Konfigürasyon Örnekleri

### Initial State ile Başlatma

```typescript
// Method 2
<CheckoutFlow
  initialStep="payment"  // Direkt ödeme adımından başla
  initialItems={["Product 1", "Product 2"]}
/>

// Method 1
<CheckoutStep2
  total={1500}
  items={["Product 1", "Product 2"]}
/>
```

### Özelleştirme

```typescript
// Custom loading state
const CheckoutFlow = dynamic(() => import("checkout/CheckoutFlow"), {
  loading: () => (
    <div className="loading-skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-body" />
    </div>
  ),
  ssr: false
});
```

---

## 🎯 Gerçek Dünya Senaryoları

### Senaryo 1: E-Ticaret Checkout

```typescript
// Product sayfasından checkout'a
export default function ProductPage({ product }) {
  const router = useRouter();
  
  const handleBuyNow = () => {
    // Sepete ekle
    addToCart(product);
    
    // Direkt checkout'a yönlendir (Method 2)
    router.push("/checkout");
  };
  
  return (
    <button onClick={handleBuyNow}>
      Hemen Al - ₺{product.price}
    </button>
  );
}
```

### Senaryo 2: Multi-Step Form

```typescript
// Method 1 ile ayrı route'lar
// /onboarding/step1
// /onboarding/step2
// /onboarding/step3

export default function OnboardingStep1() {
  const router = useRouter();
  
  return (
    <OnboardingForm
      step={1}
      onNext={(data) => {
        saveToLocalStorage("onboarding", data);
        router.push("/onboarding/step2");
      }}
    />
  );
}
```

### Senaryo 3: Dashboard Widget

```typescript
// Dashboard'da quick checkout widget
export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="widgets">
        {/* Method 1: Basit widget */}
        <CheckoutWidget itemCount={cartItems.length} />
        
        {/* Action link */}
        <Link href="/checkout">
          <a>Alışverişi Tamamla →</a>
        </Link>
      </div>
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Problem: Port Already in Use (EADDRINUSE)

**Hata:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Çözüm (Windows):**
```powershell
# PID bul
netstat -ano | findstr :3000

# Process'i öldür (10056 yerine kendi PID'inizi yazın)
taskkill /F /PID 10056

# Veya tüm Node process'lerini kapat
taskkill /F /IM node.exe
```

**Çözüm (macOS/Linux):**
```bash
# Port 3000'i temizle
kill -9 $(lsof -t -i:3000)

# Veya tüm Node process'lerini kapat
pkill -f node
```

**Detaylı bilgi:** `TROUBLESHOOTING.md` dosyasına bakın.

### Problem: Remote yüklenmiyor

**Çözüm:**
```bash
# Remote'ların çalıştığından emin olun
npm run dev:checkout  # http://localhost:3001
npm run dev:profile   # http://localhost:3002
npm run dev:shell     # http://localhost:3000
```

### Problem: TypeScript hatası

**Çözüm:**
```typescript
// apps/shell/types/federation.d.ts
declare module "checkout/CheckoutStep1" {
  const CheckoutStep1: React.ComponentType<any>;
  export default CheckoutStep1;
}
```

### Problem: Route çalışmıyor

**Çözüm:**
```bash
# Next.js cache'i temizle
rm -rf .next
npm run dev:shell
```

### Problem: Cookie yok

**Çözüm:**
```javascript
// Console'da
document.cookie = "session_token=test_token; path=/";
// Sayfayı yenile
location.reload();
```

---

## 📈 Best Practices

### 1. Loading States

```typescript
const CheckoutFlow = dynamic(() => import("checkout/CheckoutFlow"), {
  loading: () => <CheckoutSkeleton />,
  ssr: false
});
```

### 2. Error Boundaries

```typescript
<ErrorBoundary fallback={<CheckoutError />}>
  <CheckoutFlow />
</ErrorBoundary>
```

### 3. Analytics

```typescript
<CheckoutFlow
  onStepChange={(step) => {
    gtag.event("checkout_progress", { step });
  }}
/>
```

### 4. State Persistence

```typescript
// localStorage kullan
const handleStepComplete = (data) => {
  localStorage.setItem("checkout_data", JSON.stringify(data));
  router.push("/checkout/next-step");
};
```

---

## 🎓 Özet

### Method 2 (CheckoutFlow) - Ne Zaman?
- ✅ Multi-step wizard
- ✅ Kompleks flow
- ✅ Team autonomy önemli
- ✅ URL değişmese de olur

### Method 1 (Individual) - Ne Zaman?
- ✅ Basit widget'lar
- ✅ SEO önemli
- ✅ URL kontrolü gerekli
- ✅ Shell kontrolü isteniyor

---

## 🚀 Sonraki Adımlar

1. ✅ `npm run dev` ile başlat
2. ✅ Cookie ekle
3. ✅ `/checkout` ve `/checkout-method1` sayfalarını test et
4. ✅ Dashboard'daki widget'ları incele
5. 📖 `docs/MODULE-6-ROUTING-STRATEGIES.md` dosyasını oku
6. 🎯 Kendi feature'ını ekle

---

## 📞 Yardım

**Dokümantasyon:**
- `README.md` — Ana proje README
- `docs/MODULE-6-ROUTING-STRATEGIES.md` — Detaylı guide
- `docs/MODULE-6-QUICKSTART.md` — Hızlı başlangıç
- `MODULE-6-ROUTING-GUIDE.md` — Bu dosya

**Test URL'leri:**
- Dashboard: http://localhost:3000/dashboard
- Checkout (Method 2): http://localhost:3000/checkout
- Checkout (Method 1): http://localhost:3000/checkout-method1

---

**🎉 Başarılar! Artık micro-frontend routing'i kullanmaya hazırsınız.**

**Son güncelleme:** 15 Ağustos 2026
