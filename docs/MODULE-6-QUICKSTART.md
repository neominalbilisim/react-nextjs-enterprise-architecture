# Modül 6: Hızlı Başlangıç Rehberi

## 🚀 5 Dakikada Başlayın

### Adım 1: Uygulamayı Başlatın

```bash
# Kök dizinde
npm install
npm run dev
```

Bu komut 3 uygulamayı birden başlatır:
- **shell** (Host): http://localhost:3000
- **checkout-app** (Remote): http://localhost:3001
- **profile-app** (Remote): http://localhost:3002

### Adım 2: Cookie Ekleyin

Tarayıcıda console'u açın (F12) ve şunu çalıştırın:

```javascript
document.cookie = "session_token=test_token; path=/";
```

Sayfayı yenileyin.

### Adım 3: Sayfaları Gezin

1. **Dashboard**: http://localhost:3000/dashboard
   - Widget örnekleri
   - Checkout linkine geçiş

2. **Checkout Flow**: http://localhost:3000/checkout/step1
   - Shared Routes Architecture (Production-ready)
   - Stepli checkout akışı (Sepet → Ödeme → Onay)
   - React Hook Form + Zod validation
   - Zustand state management
   - Her adım ayrı URL

---

## 📖 Shared Routes Architecture

### Mimari: Component + Page Expose ⭐

**Ne zaman:** Production-ready multi-page flows, SEO önemli

**Avantajlar:**
- ✅ URL kontrol (her adım ayrı URL)
- ✅ Browser history çalışır
- ✅ SEO friendly
- ✅ Standalone testing
- ✅ Zustand state management
- ✅ React Hook Form + Zod validation
- ✅ DRY principle

**Örnek:**
```typescript
// Remote: pages/checkout/step1.tsx
export default function CheckoutStep1Page() {
  const router = useRouter();
  const items = useCheckoutStore((state) => state.items);
  
  return <CheckoutStep1 onNext={() => router.push("/checkout/step2")} />;
}

// Remote: next.config.js
exposes: {
  "./pages/CheckoutStep1Page": "./pages/checkout/step1.tsx"
}

// Host: pages/checkout/step1.tsx
const CheckoutStep1Page = dynamic(
  () => import("checkout/pages/CheckoutStep1Page"),
  { ssr: false }
);
export default CheckoutStep1Page;
```

---

## 🎯 Hızlı Test Senaryoları

### Senaryo 1: Dashboard Widget

1. `/dashboard` sayfasına gidin
2. "REMOTE · CHECKOUT-APP" widget'ını bulun
3. "Ürün Ekle" butonuna tıklayın
4. Sayacın arttığını görün

**Gözlem:** Basit widget örneği, Zustand store kullanıyor.

### Senaryo 2: Checkout Flow (Shared Routes)

1. `/checkout/step1` sayfasına gidin
2. Sepete ürün ekleyin/çıkarın (Zustand store'da tutuluyor)
3. "Ödemeye Geç" butonuna tıklayın → URL: `/checkout/step2`
4. Kart bilgilerini doldurun (React Hook Form + Zod validation)
   - Random data için "🎲 Random Doldur" butonuna tıklayın
5. "Ödemeyi Tamamla" butonuna tıklayın → URL: `/checkout/confirmation`
6. Onay sayfasını görün (tüm bilgiler Zustand'dan geliyor)
7. Browser back butonuna basın → geri gider

**Gözlem:** 
- Her adım ayrı URL
- Browser history çalışıyor
- Form validation real-time
- State Zustand'da centralized

### Senaryo 3: Standalone Testing

1. Terminal'de sadece checkout-app'i çalıştırın:
   ```bash
   npm run dev:checkout
   ```

2. `http://localhost:3001/checkout/step1` adresine gidin

3. Aynı flow'u test edin

**Gözlem:** Checkout-app bağımsız çalışıyor, aynı davranış!

---

## 🛠️ Özelleştirme Örnekleri

### Yeni Bir Remote Eklemek

```bash
# Yeni remote oluştur
cd apps
mkdir payment-app
cp -r checkout-app/* payment-app/

# Port'u değiştir (package.json)
"dev": "next dev -p 3003"

# Expose et (next.config.js)
exposes: {
  "./PaymentWidget": "./components/PaymentWidget.tsx"
}

# Shell'e ekle (shell/next.config.js)
remotes: {
  payment: `payment@http://localhost:3003/_next/static/...`
}
```

### Kendi Component'inizi Expose Etmek

1. **Component oluşturun:**
```typescript
// apps/checkout-app/components/MyWidget.tsx
export default function MyWidget({ title }) {
  return <div>{title}</div>;
}
```

2. **Expose edin:**
```javascript
// apps/checkout-app/next.config.js
exposes: {
  "./MyWidget": "./components/MyWidget.tsx"
}
```

3. **Shell'de kullanın:**
```typescript
// apps/shell/pages/my-page.tsx
const MyWidget = dynamic(() => import("checkout/MyWidget"), {
  ssr: false
});

export default function MyPage() {
  return <MyWidget title="Hello!" />;
}
```

---

## 🐛 Sık Karşılaşılan Sorunlar

### "Module not found: Can't resolve 'checkout/...'"

**Çözüm:** Remote uygulaması çalışıyor mu? `npm run dev:checkout` ile başlatın.

### "Shared module is not available for eager consumption"

**Çözüm:** `next/dynamic` ile `ssr: false` kullanın:
```typescript
const Component = dynamic(() => import("checkout/Component"), {
  ssr: false
});
```

### Remote'ta yaptığım değişiklik görünmüyor

**Çözüm:** 
1. Remote'u yeniden başlatın
2. Browser cache'i temizleyin (Ctrl+Shift+R)
3. Shell'i yeniden başlatın

### TypeScript hataları veriyor

**Çözüm:** `federation.d.ts` dosyası ekleyin:
```typescript
// apps/shell/types/federation.d.ts
declare module "checkout/*";
declare module "profile/*";
```

---

## 📚 İleri Okuma

- **Detaylı Dokümantasyon:** `docs/MODULE-6-ROUTING-STRATEGIES.md`
- **Ana README:** Projenin root'undaki `README.md`
- **Modül 5:** Module Federation temelleri
- **Webpack Module Federation:** https://webpack.js.org/concepts/module-federation/

---

## 🎓 Öğrenme Yolu

1. ✅ **Başlangıç** (bu dosya) — 5 dakika
2. 📖 **Method 1** — Basit widget oluştur, dashboard'a ekle
3. 🔄 **Method 2** — Multi-step flow oluştur
4. 🏗️ **Hybrid** — İkisini de kullan
5. 🚀 **Production** — Deploy et, optimize et

---

## 💡 Pro Tips

### Tip 1: Hot Reload
Remote'larda değişiklik yapınca Shell otomatik güncellenir. Ama bazen manual refresh gerekebilir.

### Tip 2: Console Logging
Flow içinde neler oluyor görmek için:
```typescript
<CheckoutFlow
  onStepChange={(step) => console.log('Step:', step)}
  onComplete={(data) => console.log('Done:', data)}
/>
```

### Tip 3: Error Boundaries
Production'da her remote için error boundary ekleyin:
```typescript
<ErrorBoundary fallback={<div>Widget yüklenemedi</div>}>
  <RemoteComponent />
</ErrorBoundary>
```

### Tip 4: Loading States
UX için loading state'leri önemli:
```typescript
const Remote = dynamic(() => import("checkout/Widget"), {
  loading: () => <Skeleton />,
  ssr: false
});
```

---

**🎉 Başarılar! Artık micro-frontend routing stratejilerini kullanmaya hazırsınız.**

Sorularınız için: [GitHub Issues](https://github.com/your-repo/issues)
