# npm Workspaces — Monorepo Nasıl Çalışıyor?

Bu proje **üç ayrı Next.js uygulaması** + bir ortak paket. Next.js bunları tek uygulama gibi birleştirmez. Birleştiren katman **npm workspaces**.

```
npm workspaces     →  klasörleri, bağımlılıkları, script'leri bağlar
concurrently       →  birden fazla process'i aynı terminalde paralel çalıştırır
Module Federation  →  tarayıcıda Host'un Remote kodunu yüklemesi (ayrı konu)
```

---

## 1. Workspaces nedir?

Kök `package.json` içindeki `workspaces` alanı, npm'e şunu söyler: bu klasörler ayrı paketlerdir, ama tek `npm install` ile kurulurlar.

```json
{
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

Bu glob'lar şu paketleri yakalar:

| Klasör | `package.json` `name` | Rol |
|--------|----------------------|-----|
| `apps/shell` | `shell` | Host Next.js (port 3000) |
| `apps/checkout-app` | `checkout-app` | Remote Next.js (port 3001) |
| `apps/profile-app` | `profile-app` | Remote Next.js (port 3002) |
| `packages/shared-ui` | `@repo/shared-ui` | Build-time UI paketi |

`private: true` kök paketin npm'e yayınlanamayacağını belirtir. Monorepo kökü neredeyse her zaman private'dır.

Her app kendi `next.config.js`, `pages/`, `package.json` dosyasına sahiptir. `npm run dev` onları **tek bundle'a derlemez**; üç ayrı Next process açar.

---

## 2. `npm install` ne yapar?

Kök dizinde bir kez:

```bash
npm install
```

npm:

1. Kök + tüm workspace `package.json` dosyalarını okur.
2. Ortak bağımlılıkları (ör. `react`, `next`) mümkünse kök `node_modules`'a **hoist** eder.
3. Her workspace için `node_modules/<paket-adı>` altında bir **symlink** oluşturur.
4. Tek bir `package-lock.json` yazar.

Örnek: `@repo/shared-ui` lockfile'da şöyle görünür:

```
node_modules/@repo/shared-ui  →  packages/shared-ui   (link: true)
```

Bir app `"@repo/shared-ui": "*"` dependency eklerse, npm registry'ye gitmez; yerel klasöre çözülür. Şu an hiçbir app bu paketi dependency olarak eklemediği için `Badge` henüz hiçbir yerde import edilmiyor — paket iskelet olarak duruyor.

`--workspace=` olmadan kökte `npm install` **tüm** workspace'leri kurar. Tek bir app klasöründe `npm install` çalıştırmak workspace ağacını bozar; kurulum her zaman kökten yapılır.

---

## 3. Script'ler nasıl bağlanır?

Kök script'ler:

```json
{
  "scripts": {
    "dev:shell": "npm run dev --workspace=shell",
    "dev:checkout": "npm run dev --workspace=checkout-app",
    "dev:profile": "npm run dev --workspace=profile-app",
    "dev": "concurrently -k -n shell,checkout,profile -c cyan,yellow,green \"npm:dev:shell\" \"npm:dev:checkout\" \"npm:dev:profile\"",
    "build": "npm run build --workspaces --if-present"
  }
}
```

`--workspace=<name>` npm'e “bu script'i **o paketin** `package.json`'ındaki script olarak çalıştır” der. `name` klasör adı değil, o paketin `"name"` alanıdır (`shell`, `checkout-app`, `profile-app`).

Zincir:

```
npm run dev:shell
        ↓
npm run dev --workspace=shell
        ↓
apps/shell/package.json  →  "dev": "next dev -p 3000"
```

Aynı şekilde:

| Kök komut | Workspace script | Gerçek process |
|-----------|------------------|----------------|
| `npm run dev:shell` | `shell` → `dev` | `next dev -p 3000` |
| `npm run dev:checkout` | `checkout-app` → `dev` | `next dev -p 3001` |
| `npm run dev:profile` | `profile-app` → `dev` | `next dev -p 3002` |

Bunları tek tek çalıştırabilirsiniz. `npm run dev` ise üçünü **aynı anda** başlatır — bunu `concurrently` yapar.

---

## 4. `npm run dev` — concurrently ne yapıyor?

```bash
npm run dev
```

Kök script:

```bash
concurrently -k -n shell,checkout,profile -c cyan,yellow,green \
  "npm:dev:shell" "npm:dev:checkout" "npm:dev:profile"
```

`concurrently` bir npm paketi (kök `devDependencies`). Görevi: birden fazla komutu **aynı terminalde, paralel process** olarak çalıştırmak.

### Flag'ler

| Flag | Bu projedeki değer | Anlamı |
|------|--------------------|--------|
| `-k` / `--kill-others-on-fail` | `-k` | Process'lerden biri çökerse diğerlerini de öldür. Port hatası veya Next crash olunca üçü birden durur; yarım kalmış remote'larla shell'in ayakta kalmasını engeller. |
| `-n` / `--names` | `shell,checkout,profile` | Her satırın başına isim yazar. Log karışmaz. |
| `-c` / `--prefix-colors` | `cyan,yellow,green` | İsim renkleri (shell cyan, checkout sarı, profile yeşil). |
| `npm:dev:shell` | — | `concurrently` kısayolu: kökteki `dev:shell` script'ini çalıştır. `"npm run dev:shell"` ile aynı iş. |

Terminal çıktısı kabaca şöyle görünür:

```
[shell]     ready - started server on 0.0.0.0:3000
[checkout]  ready - started server on 0.0.0.0:3001
[profile]   ready - started server on 0.0.0.0:3002
```

### Derleme nasıl oluyor?

Üç **bağımsız** `next dev` process'i açılır. Her biri kendi webpack'ini, kendi `.next/` klasörünü, kendi portunu kullanır.

```
                    concurrently
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   next dev :3000   next dev :3001   next dev :3002
      shell         checkout-app      profile-app
      .next/           .next/            .next/
```

- Tek bir “monorepo derlemesi” yoktur.
- Shell, checkout kaynak kodunu compile etmez. Tarayıcı `localhost:3000` açınca Module Federation, checkout'un `localhost:3001/_next/static/chunks/remoteEntry.js` dosyasını **runtime'da** çeker.
- Bu yüzden `dev:shell` tek başına yetmez: remote'lar ayakta değilse federated import fail olur (`CheckoutErrorBoundary`).

`Ctrl+C` concurrently'nin child process'lerini de keser (`-k` ile birlikte temizlik daha öngörülebilir).

---

## 5. `npm run build` ne oluyor?

```bash
npm run build
```

Kök script:

```bash
npm run build --workspaces --if-present
```

| Parça | Anlamı |
|-------|--------|
| `npm run build` | Her hedef pakette `build` script'ini çalıştır. |
| `--workspaces` | `workspaces` glob'undaki **tüm** paketler. |
| `--if-present` | Pakette `build` script'i yoksa hata verme, atla. |

Bu projedeki sonuç:

| Paket | `build` script'i | Ne olur |
|-------|------------------|---------|
| `shell` | `next build` | `apps/shell/.next` production bundle |
| `checkout-app` | `next build` | `apps/checkout-app/.next` + `remoteEntry.js` |
| `profile-app` | `next build` | `apps/profile-app/.next` + `remoteEntry.js` |
| `@repo/shared-ui` | yok | `--if-present` sayesinde atlanır |

Yine **üç ayrı** Next production build. Tek artifact, tek `.next` kökü yoktur.

npm workspaces build'i varsayılan olarak paketler arasında **sıra garantisi** vermez (Turborepo/Nx gibi dependency graph yok). Bu repoda app'ler birbirini npm paketi olarak import etmediği için sıra önemli değil. `shared-ui` bir güne `transpilePackages` ile bağlanırsa, o paketin önce hazır olması gerekir; şu an ayrı build adımı yok (`main` doğrudan `src/index.ts`).

Tek app build:

```bash
npm run build --workspace=shell
npm run build --workspace=checkout-app
```

Production'da her app kendi hosting'ine gider. Host'taki `NEXT_PUBLIC_CHECKOUT_URL` / `NEXT_PUBLIC_PROFILE_URL` remote'ların canlı URL'sini gösterir. `npm run build` onları birleştirmez; sadece her Next app'i kendi başına derler.

---

## 6. Kök `overrides`

```json
"overrides": {
  "webpack": "5.90.0",
  "enhanced-resolve": "5.17.1"
}
```

Tüm workspace'lerde (iç içe bağımlılıklar dahil) bu sürümler kilitlenir. `@module-federation/nextjs-mf` Next 14.2 ile bu webpack sürümünü ister; daha yeni webpack `enhanced-resolve` API'sini kırar. Bu, workspaces'in “tek yerden sürüm politikası” özelliğidir.

Kök `devDependencies.webpack` de aynı kilidi destekler: plugin yerel webpack bekler (`NEXT_PRIVATE_LOCAL_WEBPACK=true`).

---

## 7. Workspaces ≠ Module Federation

| | npm workspaces | Module Federation |
|---|---|---|
| Ne zaman | `npm install` / script çalıştırma | Tarayıcı runtime |
| Ne paylaşır | Disk, `node_modules`, ortak paketler | `exposes` edilen component'ler |
| `shared-ui` | Build-time: her app kendi bundle'ına gömer | Kullanılmaz |
| Checkout widget | Workspace sayesinde aynı repoda durur | Shell `import("checkout/CheckoutWidget")` ile yükler |

Workspaces olmasa da üç Next app ayrı klasörlerde durabilirdi; `npm install` üç kez, script'ler dağınık olurdu. Federation olmasa da workspaces çalışırdı; o zaman Host runtime'da Remote çekemezdi.

---

## 8. Sık kullanılan komutlar

```bash
# Tüm workspace'leri kur (kökten)
npm install

# Üç Next dev server (concurrently)
npm run dev

# Tek app
npm run dev:checkout

# Tüm app'lerde next build (shared-ui atlanır)
npm run build

# Workspace listesi
npm ls --workspaces --depth=0

# Belirli pakete bağımlılık ekle
npm install zustand --workspace=checkout-app
```

Port / process takılırsa: `docs/05-TROUBLESHOOTING.md`
