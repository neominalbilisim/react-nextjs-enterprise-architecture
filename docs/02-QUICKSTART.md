# Hızlı Başlangıç

## Uygulamayı başlatın

```bash
npm install
npm run dev
```

Bu komut üç uygulamayı birden başlatır:

| Uygulama | Rol | Adres |
|----------|-----|--------|
| **shell** | Host | http://localhost:3000 |
| **checkout-app** | Remote | http://localhost:3001 |
| **profile-app** | Remote | http://localhost:3002 |

Ayrı ayrı çalıştırmak için:

```bash
npm run dev:checkout   # http://localhost:3001
npm run dev:profile    # http://localhost:3002
npm run dev:shell      # http://localhost:3000 (remote'lar çalışıyor olmalı)
```

## Cookie ekleyin

`/dashboard` middleware ile korunur. `session_token` yoksa istek `/login`'e yönlendirilir.

Tarayıcı konsolunda (F12):

```javascript
document.cookie = "session_token=test_token; path=/";
```

Sayfayı yenileyin.

## Sayfalar

| Adres | Ne gösterir |
|-------|-------------|
| http://localhost:3000/dashboard | Zustand, BFF API, remote widget'lar, checkout linki |
| http://localhost:3000/checkout/step1 | Shared Routes: sepet |
| http://localhost:3000/checkout/step2 | Ödeme (React Hook Form + Zod) |
| http://localhost:3000/checkout/confirmation | Sipariş onayı |
| http://localhost:3001/checkout/step1 | Aynı checkout akışı, checkout-app standalone |

`/checkout` otomatik olarak `/checkout/step1`'e yönlendirir.

---

## Shared Routes

Remote kendi route'larını tanımlar; Host aynı path'leri import eder.

```typescript
// checkout-app: pages/checkout/step1.tsx
export default function CheckoutStep1Page() {
  const router = useRouter();
  return <CheckoutStep1 onNext={() => router.push("/checkout/step2")} />;
}

// checkout-app: next.config.js
exposes: {
  "./pages/CheckoutStep1Page": "./pages/checkout/step1.tsx"
}

// shell: pages/checkout/step1.tsx
const CheckoutStep1Page = dynamic(
  () => import("checkout/pages/CheckoutStep1Page"),
  { ssr: false }
);
```

Shell tarafında remote yükleme hataları `CheckoutErrorBoundary` ile yakalanır.

Detay: `docs/03-MODULE-FEDERATION-GUIDE.md`

---

## Test senaryoları

### Dashboard widget

1. `/dashboard` açın
2. **REMOTE · CHECKOUT-APP** kartında **Ürün Ekle**'ye tıklayın
3. Sayacın arttığını görün

Widget, `checkout/CheckoutWidget` üzerinden federated yüklenir.

### Checkout akışı (Shared Routes)

1. `/checkout/step1` — sepete ürün ekleyin/çıkarın (Zustand)
2. **Ödemeye Geç** → `/checkout/step2`
3. Kart bilgilerini doldurun (veya **Random Doldur**)
4. **Ödemeyi Tamamla** → `/checkout/confirmation`
5. Tarayıcı geri tuşu önceki adıma döner

### Standalone test

```bash
npm run dev:checkout
```

http://localhost:3001/checkout/step1 adresinde aynı akış, shell olmadan çalışır.

---

## Yeni bir remote eklemek

1. `apps/` altında yeni uygulama oluşturun (örnek: `payment-app`, port `3003`)
2. `next.config.js` içinde `exposes` tanımlayın
3. `apps/shell/next.config.js` `remotes` listesine ekleyin
4. `apps/shell/types/federation.d.ts` içine `declare module` ekleyin
5. Shell'de `next/dynamic` + `ssr: false` ile tüketin

## Kendi component'inizi expose etmek

```javascript
// apps/checkout-app/next.config.js
exposes: {
  "./MyWidget": "./components/MyWidget.tsx"
}
```

```typescript
// apps/shell/pages/my-page.tsx
const MyWidget = dynamic(() => import("checkout/MyWidget"), { ssr: false });
```

---

## Sık karşılaşılan sorunlar

### `Module not found: Can't resolve 'checkout/...'`

Remote çalışmıyor. `npm run dev:checkout` ile başlatın.

### `Shared module is not available for eager consumption`

Federated import'u `next/dynamic` + `ssr: false` ile yükleyin.

### Remote değişikliği görünmüyor

1. Remote'u yeniden başlatın
2. Hard refresh (Ctrl+Shift+R)
3. Gerekirse shell'i de yeniden başlatın

### TypeScript: `Cannot find module 'checkout/...'`

`apps/shell/types/federation.d.ts` içinde ilgili `declare module` tanımı olmalı.

Port çakışması için: `docs/05-TROUBLESHOOTING.md`

---

## Diğer dokümanlar

- `README.md` — proje yapısı ve kurulum
- `docs/01-NEXTJS-PAGES-ROUTER-GUIDE.md` — Pages Router
- `docs/03-MODULE-FEDERATION-GUIDE.md` — Shared Routes
- `docs/04-Summary.md` — mevcut dosya ve özellik özeti
- `docs/06-NPM-WORKSPACES.md` — npm workspaces, concurrently, `npm run build`
