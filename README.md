# React & Next.js Micro-Frontend Starter

**Neominal Akademi — React & NextJS Enterprise Architecture** eğitiminin
tüm modüllerini, gerçek bir **Host / Remote micro-frontend monorepo**
yapısında barındıran başlangıç projesidir (Modül 5: Webpack Module
Federation).

## Klasör Yapısı

```
apps/
  shell/            # HOST — Pages Router, port 3000
    pages/
      checkout/
        index.tsx               # /checkout (redirect to step1)
        step1.tsx               # Shared Routes: Sepet sayfası
        step2.tsx               # Shared Routes: Ödeme sayfası
        confirmation.tsx        # Shared Routes: Onay sayfası
      dashboard.tsx             # Ana dashboard
    components/
      RemoteWidgets.tsx         # Widget örnekleri
      
  checkout-app/      # REMOTE — Pages Router, port 3001
    components/
      CheckoutWidget.tsx        # METHOD 1: Basit widget
      CheckoutStep1.tsx         # METHOD 1: Individual step
      CheckoutStep2.tsx         # METHOD 1: Individual step
      CheckoutConfirmation.tsx  # METHOD 1: Individual step
      CheckoutFlow.tsx          # METHOD 2: Complete flow
    next.config.js              # Expose: widget + steps + flow
    
  profile-app/        # REMOTE — Pages Router, port 3002
    
packages/
  shared-ui/         # Build-time paylaşılan ortak component'ler (Badge vb.)
  
package.json          # npm workspaces kök yapılandırması
```

Bu, eğitimin Modül 5 & 6 slaytlarındaki **Host (shell-app) → Remote
(checkout-app, profile-app)** ilişkisinin ve **iki farklı routing stratejisinin**
birebir karşılığıdır.

## Kurulum ve Çalıştırma

```bash
npm install          # kök dizinde — tüm workspace'leri kurar
npm run dev           # shell + checkout-app + profile-app'i AYNI ANDA başlatır
```

Ayrı ayrı çalıştırmak isterseniz:

```bash
npm run dev:checkout   # http://localhost:3001
npm run dev:profile    # http://localhost:3002
npm run dev:shell      # http://localhost:3000  (Remote'lar çalışıyor olmalı)
```

`shell` uygulamasında `/dashboard` sayfasını açtığınızda, **checkout-app**
ve **profile-app**'ten runtime'da yüklenen widget'ları göreceksiniz.

`/dashboard` middleware ile korunur: `session_token` cookie'si yoksa
istek `/login`'e yönlendirilir. Yerel deneme için tarayıcıda bu cookie'yi
set edin.

## Modüllere Göre Dosya Haritası

### Modül 1 — React Fundamentals
- `apps/shell/pages/index.tsx`, `apps/checkout-app/components/CheckoutWidget.tsx`
  (useState, JSX, props)

### Modül 2 — Advanced Hooks, Memoization & Form Management
- `apps/shell/components/MemoizedList.tsx` — memo/useMemo/useCallback
- `apps/shell/hooks/useDebouncedValue.ts` — custom hook
- `apps/shell/components/ContactForm.tsx` + `lib/schemas.ts` — RHF + Zod
- `apps/shell/pages/form-demo.tsx` — form örneğinin sayfası

### Modül 3 — State Yönetimi (Context API & Zustand)
- `apps/shell/store/useDashboardStore.ts` — selector mimarisi + async action

### Modül 4 — Modern Next.js Pages Router Mimarisi
- `apps/shell/middleware.ts` — auth kontrolü (`/dashboard` → `/login`)
- `apps/shell/pages/_app.tsx` — `getLayout` ile nested layout
- `apps/shell/components/DashboardLayout.tsx` — dashboard iskeleti
- `apps/shell/components/DashboardErrorBoundary.tsx` — error boundary
- `apps/shell/pages/api/dashboard.ts` — BFF API route

### Modül 5 — Webpack Module Federation (Micro-Frontend) ⭐
- `apps/shell/next.config.js` — **Host**: `remotes` tanımı
  (`checkout@http://localhost:3001/...`, `profile@http://localhost:3002/...`)
- `apps/checkout-app/next.config.js` — **Remote**: `exposes: { './CheckoutWidget': ... }`
- `apps/profile-app/next.config.js` — **Remote**: `exposes: { './ProfileWidget': ... }`
- `apps/shell/components/RemoteWidgets.tsx` — Host'un `next/dynamic` ile
  Remote'ları `ssr:false` olarak tüketmesi
- **`shared` Yapılandırması** — npm paketlerinin Host ve Remote'lar arasında
  tek kopya olarak paylaşılması (bundle size optimizasyonu):
  - Bu projede `shared: {}` (boş): React singleton paylaşımını `@module-federation/nextjs-mf`
    plugin'i otomatik yönetir. Elle `react` paylaşmak SSR'de çift React kopyası üretir.
  - Başka paketleri paylaşmak için örnek:
    ```js
    shared: {
      zustand: { singleton: true, requiredVersion: "^4.5.0" }
    }
    ```
  - **Bundle size etkisi**: Zustand (~20 KB) her remote'da ayrı bundle'lanmak
    yerine Host'tan paylaşılır → toplam 20 KB (2 kopya yerine 1 kopya).
  - **Önemli**: `shared`, **paket kodu**'nu paylaşır, uygulama **state'ini değil**.
    Her app kendi `create()` ile kendi Zustand store'unu oluşturur; sadece
    zustand library'sinin kendisi (create, useStore fonksiyonları) paylaşılır.
- `apps/*/pages/_document.tsx` — `getInitialProps` ile Module Federation
  server runtime'ı (Next'in sayfayı statik sanmasını önler)
- `apps/checkout-app/pages/index.tsx`, `apps/profile-app/pages/index.tsx` —
  her Remote'un **bağımsız** (Host olmadan) da çalışabildiğini gösterir

### Modül 6 — Micro-Frontend Routing Stratejileri 🚀

Module Federation'da **iki farklı routing yaklaşımı** bulunur. Bu modül, her iki yöntemi
de production-ready örneklerle gösterir.

#### 🎯 İki Yöntem: METHOD 1 vs METHOD 2

| Özellik | METHOD 1: Component Expose | METHOD 2: Flow Expose |
|---------|---------------------------|----------------------|
| **Routing Kontrolü** | Host (shell) kontrolünde | Remote kontrolünde |
| **URL Yönetimi** | Shell router yönetir | Internal state (URL değişmez) |
| **Browser Back/Forward** | ✅ Çalışır | ❌ Çalışmaz (internal navigation) |
| **SEO** | ✅ Her adım ayrı URL olabilir | ⚠️ Tek URL (flow içinde) |
| **Kullanım Alanı** | Basit widget'lar, liste sayfaları | Multi-step flow'lar, wizard'lar |
| **Team Autonomy** | ⚠️ Shell'e bağımlı | ✅ Tam otonom |
| **Expose Gereksinimi** | Her component ayrı expose | Tek flow expose yeterli |
| **Entegrasyon** | Fine-grained control | Plug-and-play |

#### 📂 Dosya Haritası

**checkout-app (Remote):**
- `components/CheckoutStep1.tsx` — Sepet adımı (METHOD 1)
- `components/CheckoutStep2.tsx` — Ödeme adımı (METHOD 1)
- `components/CheckoutConfirmation.tsx` — Onay sayfası (METHOD 1)
- `components/CheckoutFlow.tsx` — Tüm flow'u yöneten component (METHOD 2)
- `next.config.js` — Hem individual component'leri hem flow'u expose eder

**shell (Host):**
- `pages/checkout/step1.tsx` — Shared Routes: checkout-app'in step1 page'ini import eder
- `pages/checkout/step2.tsx` — Shared Routes: checkout-app'in step2 page'ini import eder
- `pages/checkout/confirmation.tsx` — Shared Routes: checkout-app'in confirmation page'ini import eder
- `components/RemoteWidgets.tsx` — Widget örnekleri

#### 💡 METHOD 1: Component Expose

**Ne zaman kullanılır?**
- Dashboard widget'ları
- Liste/grid sayfaları
- Shared UI components (Button, Modal, vb.)
- SEO önemli sayfalar
- Host'un tam kontrol istendiği yerler

**Avantajları:**
- ✅ Shell routing'i kontrol eder (URL management)
- ✅ Browser back/forward çalışır
- ✅ SEO friendly (her adım ayrı URL)
- ✅ Fine-grained control
- ✅ Modüler yapı (her component bağımsız)

**Dezavantajları:**
- ❌ Her component için expose tanımı gerekli
- ❌ Shell ile Remote arasında daha fazla koordinasyon
- ❌ Remote'un internal flow'u shell'e bağımlı

**Örnek Kullanım:**
```typescript
// apps/checkout-app/next.config.js
exposes: {
  "./CheckoutStep1": "./components/CheckoutStep1.tsx",
  "./CheckoutStep2": "./components/CheckoutStep2.tsx",
  "./CheckoutConfirmation": "./components/CheckoutConfirmation.tsx",
}

// apps/shell/pages/checkout-step1.tsx
const CheckoutStep1 = dynamic(() => import("checkout/CheckoutStep1"), {
  ssr: false
});

export default function Step1Page() {
  const router = useRouter();
  
  const handleNext = (data) => {
    // Shell routing'i yönetir
    router.push('/checkout-step2');
  };
  
  return <CheckoutStep1 onNext={handleNext} />;
}
```

**Gerçek Dünya Örnekleri:**
- **Netflix**: Ana sayfadaki recommendation widget'ları
- **Amazon**: Product card'lar, filter component'leri
- **Spotify**: PlayButton, NowPlaying widget'ı

#### 🔄 METHOD 2: Flow Expose

**Ne zaman kullanılır?**
- Multi-step wizard'lar (checkout, onboarding, vb.)
- Kompleks form flow'ları
- Oyun, quiz gibi interactive uygulamalar
- Team'in tam otonom çalışması gereken yerler
- Internal state yönetimi kritik olan işlemler

**Avantajları:**
- ✅ Remote tam otonom (kendi routing'ini yönetir)
- ✅ Tek expose tanımı yeterli
- ✅ Kompleks flow'lar için ideal
- ✅ Plug-and-play entegrasyon
- ✅ Team bağımsızlığı maksimum

**Dezavantajları:**
- ❌ URL değişmez (browser'da her zaman aynı URL)
- ❌ Browser back/forward çalışmaz (internal state)
- ❌ SEO için uygun değil
- ❌ Shell'in flow içeriğinden haberi yok

**Örnek Kullanım:**
```typescript
// apps/checkout-app/next.config.js
exposes: {
  "./CheckoutFlow": "./components/CheckoutFlow.tsx",
}

// apps/checkout-app/components/CheckoutFlow.tsx
export default function CheckoutFlow() {
  const [step, setStep] = useState('cart');
  
  // Remote kendi routing'ini yönetir
  if (step === 'cart') return <CheckoutStep1 onNext={() => setStep('payment')} />;
  if (step === 'payment') return <CheckoutStep2 onNext={() => setStep('confirm')} />;
  return <CheckoutConfirmation />;
}

// apps/shell/pages/checkout/step1.tsx
const CheckoutStep1Page = dynamic(
  () => import("checkout/pages/CheckoutStep1Page"),
  { ssr: false }
);

export default CheckoutStep1Page;
```

**Gerçek Dünya Örnekleri:**
- **Zalando**: Multi-step checkout flow
- **Airbnb**: Booking wizard
- **Stripe**: Payment setup flow

#### 🏆 Best Practice: Hybrid Yaklaşım

**Production'da en yaygın kullanım her ikisini de kullanmaktır:**

```javascript
// checkout-app/next.config.js
exposes: {
  // METHOD 1: Basit widget'lar
  "./CheckoutWidget": "./components/CheckoutWidget.tsx",
  "./OrderHistory": "./components/OrderHistory.tsx",
  
  // METHOD 2: Kompleks flow'lar
  "./CheckoutFlow": "./components/CheckoutFlow.tsx",
  "./OnboardingWizard": "./components/OnboardingWizard.tsx",
}
```

**Karar Verme Rehberi:**
1. **Basit, stateless, tek iş yapan** → METHOD 1
2. **Kompleks, stateful, multi-step** → METHOD 2
3. **SEO kritik** → METHOD 1
4. **Team autonomy kritik** → METHOD 2
5. **URL kontrolü gerekli** → METHOD 1
6. **Internal flow kompleks** → METHOD 2

#### 🔍 Canlı Demo

```bash
npm run dev
```

Tarayıcıda:
- `/dashboard` — Ana dashboard ve widget örnekleri
- `/checkout/step1` — Checkout akışı (Sepet → Ödeme → Onay)
- `/checkout/step2` — Ödeme sayfası (React Hook Form + Zod)
- `/checkout/confirmation` — Sipariş onay sayfası

Cookie ekleyin (console'da):
```javascript
document.cookie = "session_token=test_token; path=/";
```

## Neden Tüm Uygulamalar Pages Router Kullanıyor?

`@module-federation/nextjs-mf` **App Directory'yi desteklemez** (`app/`
klasörü varsa plugin bilinçli olarak hata fırlatır). Host ve Remote'lar
bu yüzden Pages Router (`pages/`) kullanır.

Plugin ayrıca Next'in gömülü webpack'i yerine yerel webpack ister:

- Her `next.config.js` içinde `NEXT_PRIVATE_LOCAL_WEBPACK=true`
- `webpack@5.90.0` (Next.js 14.2 ile uyumlu; daha yeni webpack
  `enhanced-resolve` API'sini kırar)

Kök `package.json` içindeki `overrides` bu sürümleri kilitler.

## Production'a Taşırken

- Her app'i **ayrı** bir hosting'e (Vercel, kendi sunucunuz vb.) deploy edin.
- Host'taki `next.config.js` içinde `NEXT_PUBLIC_CHECKOUT_URL` ve
  `NEXT_PUBLIC_PROFILE_URL` ortam değişkenlerini production Remote
  URL'lerine göre ayarlayın.
- React/react-dom versiyonlarını tüm apps arasında senkron tutun —
  versiyon uyuşmazlığı runtime hatasına yol açabilir
  (bkz. eğitim Modül 5, "Enterprise Dikkat Noktası").

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14 (Pages Router) |
| Micro-Frontend | @module-federation/nextjs-mf |
| Bundler | webpack 5.90.0 |
| UI | React 18 |
| State Management | Zustand |
| Form & Validation | React Hook Form + Zod |
| Styling | Tailwind CSS (shell) / inline styles (Remote'lar — framework-agnostic örnek) |
| Monorepo | npm workspaces |
| Dil | TypeScript |
