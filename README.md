# React & Next.js Micro-Frontend Starter

**Neominal Akademi — React & NextJS Enterprise Architecture** eğitiminin
tüm modüllerini, gerçek bir **Host / Remote micro-frontend monorepo**
yapısında barındıran başlangıç projesidir.

## Klasör Yapısı

```
apps/
  shell/                 # HOST — Pages Router, port 3000
    pages/
      checkout/
        index.tsx        # /checkout → /checkout/step1
        step1.tsx        # Shared Routes: sepet
        step2.tsx        # Shared Routes: ödeme
        confirmation.tsx # Shared Routes: onay
      dashboard.tsx
      login.tsx
      form-demo.tsx
      api/dashboard.ts
    components/
      RemoteWidgets.tsx
      CheckoutErrorBoundary.tsx
    middleware.ts
    types/federation.d.ts

  checkout-app/          # REMOTE — Pages Router, port 3001
    pages/checkout/      # step1, step2, confirmation (standalone + federated)
    components/          # CheckoutWidget, CheckoutStep1/2, CheckoutConfirmation
    store/useCheckoutStore.ts
    next.config.js       # exposes

  profile-app/           # REMOTE — Pages Router, port 3002
    components/ProfileWidget.tsx

packages/
  shared-ui/             # Build-time paylaşılan component'ler (Badge)

docs/
  01-NEXTJS-PAGES-ROUTER-GUIDE.md
  02-QUICKSTART.md
  03-MODULE-FEDERATION-GUIDE.md
  04-Summary.md
  05-TROUBLESHOOTING.md
  06-NPM-WORKSPACES.md
```

## Kurulum ve Çalıştırma

```bash
npm install
npm run dev           # shell + checkout-app + profile-app
```

Ayrı ayrı:

```bash
npm run dev:checkout   # http://localhost:3001
npm run dev:profile    # http://localhost:3002
npm run dev:shell      # http://localhost:3000  (remote'lar çalışıyor olmalı)
```

`/dashboard` middleware ile korunur: `session_token` cookie'si yoksa
istek `/login`'e yönlendirilir. Yerel deneme:

```javascript
document.cookie = "session_token=test_token; path=/";
```

Adresler:

- `/dashboard` — Zustand, BFF API, remote widget'lar
- `/checkout/step1` — sepet → ödeme → onay (Shared Routes)
- http://localhost:3001/checkout/step1 — aynı akış, standalone

Detaylı adımlar: `docs/02-QUICKSTART.md`  
Monorepo / `npm run dev` / `npm run build`: `docs/06-NPM-WORKSPACES.md`

## Modüllere Göre Dosya Haritası

### Modül 1 — React Fundamentals

- `apps/shell/pages/index.tsx`, `apps/checkout-app/components/CheckoutWidget.tsx`
  (useState, JSX, props)

### Modül 2 — Advanced Hooks, Memoization & Form Management

- `apps/shell/components/MemoizedList.tsx` — memo/useMemo/useCallback
- `apps/shell/hooks/useDebouncedValue.ts` — custom hook
- `apps/shell/components/ContactForm.tsx` + `lib/schemas.ts` — RHF + Zod
- `apps/shell/pages/form-demo.tsx`

### Modül 3 — State Yönetimi (Context API & Zustand)

- `apps/shell/store/useDashboardStore.ts` — selector + async action
- `apps/checkout-app/store/useCheckoutStore.ts` — checkout sepet/ödeme state

### Modül 4 — Modern Next.js Pages Router Mimarisi

- `apps/shell/middleware.ts` — auth (`/dashboard` → `/login`)
- `apps/shell/pages/_app.tsx` — `getLayout` ile nested layout
- `apps/shell/components/DashboardLayout.tsx`
- `apps/shell/components/DashboardErrorBoundary.tsx`
- `apps/shell/pages/api/dashboard.ts` — BFF API route

### Modül 5 — Webpack Module Federation

- `apps/shell/next.config.js` — Host `remotes`
  (`checkout@http://localhost:3001/...`, `profile@http://localhost:3002/...`)
- `apps/checkout-app/next.config.js` — Remote `exposes`
- `apps/profile-app/next.config.js` — `./ProfileWidget`
- `apps/shell/components/RemoteWidgets.tsx` — `next/dynamic` + `ssr: false`
- **`shared`:** Bu projede shell `shared: {}` bırakır. React singleton
  paylaşımını `@module-federation/nextjs-mf` otomatik yönetir. Elle `react`
  paylaşmak SSR'de çift React kopyası üretir.
  Checkout-app Zustand'ı paylaşır:

  ```js
  shared: {
    zustand: { singleton: true, requiredVersion: "^4.5.0" }
  }
  ```

  `shared` paket kodunu paylaşır, uygulama state'ini değil. Her app kendi
  `create()` ile kendi store'unu oluşturur.
- `apps/*/pages/_document.tsx` — `getInitialProps` ile Module Federation
  server runtime
- `apps/checkout-app/pages/index.tsx`, `apps/profile-app/pages/index.tsx` —
  remote'ların Host olmadan da çalışması

### Modül 6 — Shared Routes (checkout akışı)

Checkout route'ları **checkout-app** içinde tanımlanır. Shell aynı
path'lerde remote page'leri import eder.

| Shell | Checkout-app | Sayfa |
|-------|--------------|--------|
| `/checkout` | — | `step1`'e yönlendirme |
| `/checkout/step1` | `/checkout/step1` | Sepet |
| `/checkout/step2` | `/checkout/step2` | Ödeme (RHF + Zod) |
| `/checkout/confirmation` | `/checkout/confirmation` | Onay |

```javascript
// checkout-app/next.config.js
exposes: {
  "./pages/CheckoutStep1Page": "./pages/checkout/step1.tsx",
  "./pages/CheckoutStep2Page": "./pages/checkout/step2.tsx",
  "./pages/CheckoutConfirmationPage": "./pages/checkout/confirmation.tsx",
}
```

```typescript
// shell/pages/checkout/step1.tsx
const CheckoutStep1Page = dynamic(
  () => import("checkout/pages/CheckoutStep1Page"),
  { ssr: false }
);
```

Dashboard'da ayrıca `CheckoutWidget` ve `CheckoutStep1` component olarak
yüklenir (`RemoteWidgets.tsx`). Remote yükleme hataları
`CheckoutErrorBoundary` ile yakalanır.

Mimari detay: `docs/03-MODULE-FEDERATION-GUIDE.md`

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

- Her app'i **ayrı** bir hosting'e deploy edin.
- Host'taki `next.config.js` içinde `NEXT_PUBLIC_CHECKOUT_URL` ve
  `NEXT_PUBLIC_PROFILE_URL` ortam değişkenlerini production Remote
  URL'lerine göre ayarlayın.
- React/react-dom versiyonlarını tüm apps arasında senkron tutun —
  versiyon uyuşmazlığı runtime hatasına yol açabilir.

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14 (Pages Router) |
| Micro-Frontend | @module-federation/nextjs-mf |
| Bundler | webpack 5.90.0 |
| UI | React 18 |
| State Management | Zustand |
| Form & Validation | React Hook Form + Zod |
| Styling | Tailwind CSS (shell) / inline styles (Remote'lar) |
| Monorepo | npm workspaces |
| Dil | TypeScript |
