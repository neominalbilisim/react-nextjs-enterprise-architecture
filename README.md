# React & Next.js Micro-Frontend Starter

**Neominal Akademi — React & NextJS Enterprise Architecture** eğitiminin
tüm modüllerini, gerçek bir **Host / Remote micro-frontend monorepo**
yapısında barındıran başlangıç projesidir (Modül 5: Webpack Module
Federation).

## Klasör Yapısı

```
apps/
  shell/            # HOST — Pages Router, port 3000
  checkout-app/      # REMOTE — Pages Router, port 3001, exposes CheckoutWidget
  profile-app/        # REMOTE — Pages Router, port 3002, exposes ProfileWidget
packages/
  shared-ui/         # Build-time paylaşılan ortak component'ler (Badge vb.)
package.json          # npm workspaces kök yapılandırması
```

Bu, eğitimin Modül 5 slaytlarındaki **Host (shell-app) → Remote
(checkout-app, profile-app)** ilişkisinin birebir karşılığıdır.

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
