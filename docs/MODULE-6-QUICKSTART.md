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
   - Method 1 widget örnekleri
   - Method 2'ye geçiş linkleri

2. **Method 2 Checkout**: http://localhost:3000/checkout
   - CheckoutFlow kullanımı
   - Remote kendi routing'ini yönetir
   - URL değişmez

3. **Method 1 Checkout**: http://localhost:3000/checkout-method1
   - Individual component kullanımı
   - Shell routing'i yönetir
   - Progress indicator

---

## 📖 Method 1 vs Method 2

### Method 1: Component Expose ✅

**Ne zaman:** Widget'lar, liste sayfaları, SEO önemli

**Avantajlar:**
- URL kontrol
- Browser history
- SEO friendly

**Örnek:**
```typescript
// Remote expose
exposes: {
  "./CheckoutStep1": "./components/CheckoutStep1.tsx"
}

// Host kullanım
import CheckoutStep1 from "checkout/CheckoutStep1";
<CheckoutStep1 onNext={handleNext} />
```

### Method 2: Flow Expose 🔄

**Ne zaman:** Multi-step wizard'lar, kompleks flow'lar

**Avantajlar:**
- Team autonomy
- Tek expose
- Internal routing

**Örnek:**
```typescript
// Remote expose
exposes: {
  "./CheckoutFlow": "./components/CheckoutFlow.tsx"
}

// Host kullanım
import CheckoutFlow from "checkout/CheckoutFlow";
<CheckoutFlow onComplete={handleComplete} />
```

---

## 🎯 Hızlı Test Senaryoları

### Senaryo 1: Dashboard Widget (Method 1)

1. `/dashboard` sayfasına gidin
2. "REMOTE · CHECKOUT-APP" widget'ını bulun
3. "Ürün Ekle" butonuna tıklayın
4. Sayacın arttığını görün

**Gözlem:** Basit widget, state shell'e taşınmıyor.

### Senaryo 2: Method 2 Flow

1. `/checkout` sayfasına gidin
2. Sepete ürün ekleyin/çıkarın
3. "Ödemeye Geç" butonuna tıklayın
4. Kart bilgilerini doldurun (örnek: 1234 5678 9012 3456)
5. "Ödemeyi Tamamla" butonuna tıklayın
6. Onay sayfasını görün

**Gözlem:** URL değişmedi, ama flow içinde gezindik. Browser back butonu çalışmıyor.

### Senaryo 3: Method 1 Individual Components

1. `/checkout-method1` sayfasına gidin
2. Aynı flow'u tekrarlayın
3. Browser back butonuna basın

**Gözlem:** Shell routing kontrolünde, browser history çalışıyor (shallow routing eklerseniz).

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
