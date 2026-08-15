# Proje Özeti

Host / Remote micro-frontend monorepo. Shell (Host) checkout-app ve profile-app widget'larını runtime'da yükler; checkout akışı **Shared Routes** ile aynı path'lerde hem shell'de hem standalone remote'da çalışır.

---

## Uygulamalar

| App | Rol | Port |
|-----|-----|------|
| `apps/shell` | Host | 3000 |
| `apps/checkout-app` | Remote | 3001 |
| `apps/profile-app` | Remote | 3002 |
| `packages/shared-ui` | Build-time paylaşılan UI (`Badge`) | — |

---

## Checkout-app (Remote)

```
apps/checkout-app/
├── pages/
│   ├── checkout/
│   │   ├── step1.tsx              # /checkout/step1
│   │   ├── step2.tsx              # /checkout/step2
│   │   └── confirmation.tsx       # /checkout/confirmation
│   └── index.tsx                  # standalone giriş
├── components/
│   ├── CheckoutWidget.tsx         # dashboard widget
│   ├── CheckoutStep1.tsx          # sepet UI
│   ├── CheckoutStep2.tsx          # ödeme UI (RHF + Zod)
│   ├── CheckoutConfirmation.tsx   # onay UI
│   └── CheckoutFlow.tsx           # expose edilir, shell route'larında kullanılmaz
├── store/
│   └── useCheckoutStore.ts        # Zustand
└── next.config.js                 # exposes
```

`next.config.js` expose listesi:

- `./CheckoutWidget`
- `./CheckoutStep1`, `./CheckoutStep2`, `./CheckoutConfirmation`
- `./pages/CheckoutStep1Page`, `./pages/CheckoutStep2Page`, `./pages/CheckoutConfirmationPage`
- `./CheckoutFlow`

---

## Shell (Host)

```
apps/shell/
├── pages/
│   ├── checkout/
│   │   ├── index.tsx              # /checkout → /checkout/step1
│   │   ├── step1.tsx              # remote page import
│   │   ├── step2.tsx
│   │   └── confirmation.tsx
│   ├── dashboard.tsx
│   ├── login.tsx
│   ├── form-demo.tsx
│   └── api/dashboard.ts
├── components/
│   ├── RemoteWidgets.tsx          # CheckoutWidget + ProfileWidget + CheckoutStep1
│   ├── CheckoutErrorBoundary.tsx  # federated yükleme / render hataları
│   ├── DashboardLayout.tsx
│   ├── DashboardErrorBoundary.tsx
│   ├── ContactForm.tsx
│   └── MemoizedList.tsx
├── middleware.ts                  # /dashboard → session_token
├── store/useDashboardStore.ts
└── types/federation.d.ts
```

---

## Çalışan özellikler

**Shared Routes (checkout):** Remote kendi `/checkout/*` sayfalarını tanımlar. Shell aynı path'lerde bu sayfaları `next/dynamic` + `ssr: false` ile import eder. Zustand sepet/ödeme state'ini tutar. Step 2'de React Hook Form + Zod kullanılır.

**Dashboard widget'ları:** `RemoteWidgets` checkout-app ve profile-app component'lerini federated yükler. Checkout remote hataları `CheckoutErrorBoundary` ile yakalanır.

**Standalone:** `npm run dev:checkout` ile http://localhost:3001/checkout/step1 aynı akışı shell olmadan çalıştırır.

---

## Route eşlemesi

| Shell | Checkout-app | İçerik |
|-------|--------------|--------|
| `/checkout` | — | `step1`'e yönlendirme |
| `/checkout/step1` | `/checkout/step1` | Sepet |
| `/checkout/step2` | `/checkout/step2` | Ödeme |
| `/checkout/confirmation` | `/checkout/confirmation` | Onay |
| `/dashboard` | — | Widget'lar + checkout linki (auth cookie) |

---

## Dokümanlar

- `README.md` — kurulum, klasör yapısı, teknoloji
- `docs/01-NEXTJS-PAGES-ROUTER-GUIDE.md` — Pages Router
- `docs/02-QUICKSTART.md` — çalıştırma ve test
- `docs/03-MODULE-FEDERATION-GUIDE.md` — Shared Routes
- `docs/05-TROUBLESHOOTING.md` — port / process sorunları
- `docs/06-NPM-WORKSPACES.md` — npm workspaces, concurrently, build
