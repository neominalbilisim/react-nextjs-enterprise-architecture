# 📘 Next.js Pages Router - Kapsamlı Kılavuz

Bu döküman, Next.js Pages Router'ın tüm özelliklerini detaylı olarak açıklar.

---

## 📑 İçindekiler

1. [Pages Router Nedir?](#pages-router-nedir)
2. [Klasör Yapısı](#klasör-yapısı)
3. [Özel Dosyalar (_document, _app, _error)](#özel-dosyalar)
4. [Data Fetching Methods](#data-fetching-methods)
5. [Routing](#routing)
6. [Layout Patterns](#layout-patterns)
7. [Dynamic Imports](#dynamic-imports)
8. [Performance & Optimization](#performance--optimization)
9. [Module Federation](#module-federation)
10. [Error Handling](#error-handling)
11. [Best Practices](#best-practices)

---

## 📚 Pages Router Nedir?

Pages Router, Next.js'in **dosya tabanlı routing sistemi**dir (Next.js 13 öncesi ana yöntem).

### Temel Prensip

```
pages/
  index.tsx        →  /
  about.tsx        →  /about
  blog/
    index.tsx      →  /blog
    [slug].tsx     →  /blog/:slug
```

**Dosya = Route**

---

## 🗂️ Klasör Yapısı

### Temel Yapı

```
my-app/
├── pages/                    # 🎯 ROUTING KATMANI
│   ├── _app.tsx             # ⚙️ Global app wrapper
│   ├── _document.tsx        # 📄 HTML document wrapper
│   ├── _error.tsx           # ❌ Custom error page
│   ├── index.tsx            # 🏠 / (ana sayfa)
│   ├── about.tsx            # 📄 /about
│   ├── blog/
│   │   ├── index.tsx        # 📄 /blog
│   │   ├── [slug].tsx       # 📄 /blog/:slug (dynamic)
│   │   └── [...]slug].tsx   # 📄 /blog/* (catch-all)
│   ├── api/                 # 🔌 API Routes
│   │   ├── hello.ts         # /api/hello
│   │   └── users/
│   │       └── [id].ts      # /api/users/:id
│   └── 404.tsx              # 🚫 Custom 404 page
│
├── components/              # 🧩 Reusable components
├── lib/                     # 🛠️ Utility functions
├── styles/                  # 🎨 Global styles
├── public/                  # 📁 Static files
└── next.config.js           # ⚙️ Next.js configuration
```

---

## 🎭 Özel Dosyalar (_document, _app, _error)

### 1️⃣ `_app.tsx` - Global App Wrapper

**Ne işe yarar?**
- Tüm sayfalarda ortak layout
- Global state provider'lar (Zustand, Context)
- Global CSS import
- Page geçişlerinde state persistence

**Örnek:**

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  // Her sayfa yüklendiğinde çalışır
  useEffect(() => {
    console.log('Page changed!');
  }, []);

  return (
    <div>
      {/* Global Header */}
      <header>My App Header</header>
      
      {/* Sayfa component'i */}
      <Component {...pageProps} />
      
      {/* Global Footer */}
      <footer>My App Footer</footer>
    </div>
  );
}
```

**Lifecycle:**
```
Browser Request
    ↓
_app.tsx (Global wrapper)
    ↓
pages/about.tsx (Specific page)
    ↓
Rendered to user
```

**Ne zaman kullanılır?**
- ✅ Global layout
- ✅ Zustand/Redux Provider
- ✅ Analytics (GA, Mixpanel)
- ✅ Authentication wrapper
- ✅ Theme provider

---

### 2️⃣ `_document.tsx` - HTML Document Wrapper

**Ne işe yarar?**
- HTML `<html>`, `<head>`, `<body>` tag'lerini özelleştirme
- Custom fonts
- Meta tags (lang, charset)
- Server-side rendering configuration
- **Module Federation için SSR flag**

**Örnek:**

```typescript
// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';
import type { DocumentContext, DocumentInitialProps } from 'next/document';

class MyDocument extends Document {
  // ⚠️ Bu method olmadan Next.js statik build yapar
  // Module Federation için ZORUNLU
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="tr">
        <Head>
          {/* Custom fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          
          {/* Global meta tags */}
          <meta name="theme-color" content="#000000" />
        </Head>
        <body>
          {/* Main app content */}
          <Main />
          
          {/* Next.js scripts */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

**_app.tsx vs _document.tsx:**

| Feature | _app.tsx | _document.tsx |
|---------|----------|---------------|
| **Çalışma yeri** | Client + Server | Server only |
| **State kullanımı** | ✅ useState, useEffect | ❌ Sadece static |
| **Re-render** | Her page geçişinde | Sadece ilk yüklemede |
| **Kullanım** | Layout, providers | HTML structure |
| **CSS import** | ✅ Global CSS | ❌ Sadece styled-jsx |

**Ne zaman kullanılır?**
- ✅ Custom fonts (Google Fonts)
- ✅ HTML lang attribute
- ✅ Server-side rendering config
- ✅ **Module Federation SSR fix**
- ✅ Third-party scripts (Analytics)

---

### 3️⃣ `_error.tsx` - Custom Error Page

**Ne işe yarar?**
- 404, 500 gibi hataları özelleştirme
- Custom error UI
- Error tracking (Sentry, Datadog)

**Örnek:**

```typescript
// pages/_error.tsx
import type { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>
        {statusCode
          ? `Server Error: ${statusCode}`
          : 'Client Error'}
      </h1>
      <p>
        {statusCode === 404
          ? 'Sayfa bulunamadı'
          : 'Bir hata oluştu'}
      </p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
```

**404.tsx vs _error.tsx:**

| File | Kullanım |
|------|----------|
| `404.tsx` | Sadece 404 hataları |
| `_error.tsx` | Tüm hatalar (404, 500, vb.) |

---

## 📡 Data Fetching Methods

Next.js Pages Router'da **3 ana data fetching method** var:

### 1️⃣ `getStaticProps` - Static Site Generation (SSG)

**Ne zaman çalışır?** Build time'da (npm run build)

**Kullanım:**

```typescript
// pages/blog/[slug].tsx
import type { GetStaticProps, GetStaticPaths } from 'next';

interface Post {
  id: string;
  title: string;
  content: string;
}

interface Props {
  post: Post;
}

export default function BlogPost({ post }: Props) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

// Build time'da çalışır
export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { slug } = context.params!;
  
  // API call (build time'da)
  const res = await fetch(`https://api.example.com/posts/${slug}`);
  const post = await res.json();
  
  return {
    props: { post },
    revalidate: 60, // ISR: 60 saniyede bir revalidate
  };
};

// Dynamic route için gerekli
export const getStaticPaths: GetStaticPaths = async () => {
  // Tüm post'ları al
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  
  // Path'leri oluştur
  const paths = posts.map((post: Post) => ({
    params: { slug: post.id },
  }));
  
  return {
    paths,
    fallback: 'blocking', // Yeni path'ler için server'da render et
  };
};
```

**Özellikler:**
- ✅ **En hızlı** (HTML önceden oluşturulur)
- ✅ SEO friendly
- ✅ CDN cache'lenebilir
- ✅ ISR (Incremental Static Regeneration) ile güncelleme
- ❌ Real-time data yok (revalidate süresine bağlı)

**Ne zaman kullanılır?**
- Blog posts
- Product pages
- Landing pages
- Marketing pages

---

### 2️⃣ `getServerSideProps` - Server-Side Rendering (SSR)

**Ne zaman çalışır?** Her request'te (server'da)

**Kullanım:**

```typescript
// pages/dashboard.tsx
import type { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

interface Props {
  user: {
    name: string;
    email: string;
  };
  data: any;
}

export default function Dashboard({ user, data }: Props) {
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  // Cookies
  const cookies = parseCookies(context);
  const token = cookies.session_token;
  
  // Authentication check
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  // Fetch user data (her request'te)
  const res = await fetch('https://api.example.com/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const user = await res.json();
  
  // Fetch dashboard data
  const dataRes = await fetch('https://api.example.com/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await dataRes.json();
  
  return {
    props: { user, data },
  };
};
```

**Özellikler:**
- ✅ Real-time data
- ✅ Authentication (cookies, headers)
- ✅ Personalized content
- ❌ Daha yavaş (her request'te server çalışır)
- ❌ CDN cache'lenemez

**Ne zaman kullanılır?**
- User dashboard
- Admin panel
- Real-time data (stock prices)
- Authentication-required pages

---

### 3️⃣ `getInitialProps` - Legacy Method

**⚠️ DEPRECATED**: Yeni projelerde `getStaticProps` veya `getServerSideProps` kullanın!

**Neden hala kullanılıyor?**
- Legacy kod
- `_app.tsx` ve `_document.tsx` için
- **Module Federation için SSR flag**

**Kullanım:**

```typescript
// pages/_document.tsx
import Document, { DocumentContext, DocumentInitialProps } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    // Module Federation için SSR aktif et
    return Document.getInitialProps(ctx);
  }
}
```

**getInitialProps vs getServerSideProps:**

| Feature | getInitialProps | getServerSideProps |
|---------|----------------|-------------------|
| **Çalışma yeri** | Client + Server | Server only |
| **Type safety** | ⚠️ Zayıf | ✅ Güçlü |
| **Automatic static** | ❌ Hayır | ✅ Evet |
| **Recommendation** | ❌ Kullanma | ✅ Kullan |

---

## 🛣️ Routing

### Static Routes

```
pages/
  index.tsx        →  /
  about.tsx        →  /about
  contact.tsx      →  /contact
  blog/
    index.tsx      →  /blog
    first-post.tsx →  /blog/first-post
```

### Dynamic Routes

#### Single Dynamic Route

```typescript
// pages/blog/[slug].tsx
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  
  return <h1>Post: {slug}</h1>;
}
```

**URL Examples:**
- `/blog/hello-world` → `slug = "hello-world"`
- `/blog/nextjs-guide` → `slug = "nextjs-guide"`

#### Multi Dynamic Route

```typescript
// pages/blog/[...slug].tsx (catch-all)
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query; // slug is string[]
  
  return <h1>Path: {slug?.join('/')}</h1>;
}
```

**URL Examples:**
- `/blog/2023/10/hello` → `slug = ["2023", "10", "hello"]`
- `/blog/category/tech` → `slug = ["category", "tech"]`

#### Optional Catch-All

```typescript
// pages/blog/[[...slug]].tsx
// Matches /blog AND /blog/anything
```

### Nested Routes

```typescript
// pages/dashboard/settings/profile.tsx
export default function Profile() {
  return <h1>Profile Settings</h1>;
}
// URL: /dashboard/settings/profile
```

### Route Groups (Organizasyon)

```
pages/
  (auth)/           # Grouping, URL'e etki etmez
    login.tsx       →  /login (not /(auth)/login)
    register.tsx    →  /register
```

**Not:** Pages Router'da route groups yok, sadece App Router'da var.

---

## 🎨 Layout Patterns

Pages Router'da layout için **3 ana pattern** var:

### Pattern 1: _app.tsx ile Global Layout

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}
```

**Problem:** Her sayfa aynı layout kullanır.

---

### Pattern 2: Per-Page Layout (Recommended)

```typescript
// components/DashboardLayout.tsx
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-layout">
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}

// pages/dashboard.tsx
import type { ReactElement } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { NextPageWithLayout } from './_app';

const DashboardPage: NextPageWithLayout = () => {
  return <h1>Dashboard</h1>;
};

// Layout assignment
DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;

// pages/_app.tsx
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  
  return getLayout(<Component {...pageProps} />);
}
```

**Avantajlar:**
- ✅ Her sayfa kendi layout'unu seçer
- ✅ Layout state persist (page geçişlerinde)
- ✅ Nested layouts mümkün

---

### Pattern 3: Nested Layouts

```typescript
// components/MainLayout.tsx
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

// components/DashboardLayout.tsx
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// pages/dashboard.tsx
DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </MainLayout>
  );
};
```

---

## ⚡ Dynamic Imports

### `next/dynamic` - Lazy Loading

**Ne işe yarar?**
- Component'leri lazy load etme
- Bundle size küçültme
- SSR'yi disable etme

**Kullanım:**

```typescript
import dynamic from 'next/dynamic';

// Basic usage
const DynamicComponent = dynamic(() => import('@/components/Heavy'));

// With loading state
const DynamicComponentWithLoading = dynamic(
  () => import('@/components/Heavy'),
  {
    loading: () => <p>Loading...</p>,
  }
);

// Disable SSR (for browser-only components)
const NoSSR = dynamic(
  () => import('@/components/BrowserOnly'),
  { ssr: false }
);

// Named export
const DynamicComponentNamed = dynamic(
  () => import('@/components/Heavy').then((mod) => mod.HeavyComponent)
);

export default function Page() {
  return (
    <div>
      <DynamicComponent />
      <DynamicComponentWithLoading />
      <NoSSR />
    </div>
  );
}
```

### Module Federation ile Dynamic Import

```typescript
// pages/dashboard.tsx
import dynamic from 'next/dynamic';

// Remote component import (Module Federation)
const CheckoutWidget = dynamic(
  () => import('checkout/CheckoutWidget'),
  {
    ssr: false, // ⚠️ Module Federation için genelde false
    loading: () => <div>Widget yükleniyor...</div>,
  }
);

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <CheckoutWidget />
    </div>
  );
}
```

**ssr: false neden?**
- Module Federation server'da çalışmaz (runtime dependency)
- Remote app'in server'da olmaması gerekebilir
- Client-only rendering garantisi

---

## 🚀 Performance & Optimization

### 1. Image Optimization

```typescript
import Image from 'next/image';

export default function Page() {
  return (
    <div>
      {/* Optimized image */}
      <Image
        src="/hero.jpg"
        alt="Hero"
        width={800}
        height={600}
        priority // Above the fold için
      />
      
      {/* External image */}
      <Image
        src="https://example.com/image.jpg"
        alt="External"
        width={400}
        height={300}
        loading="lazy"
      />
      
      {/* Fill layout */}
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}
```

**next.config.js:**

```javascript
module.exports = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
};
```

**Avantajlar:**
- ✅ Automatic WebP/AVIF conversion
- ✅ Lazy loading
- ✅ Responsive images
- ✅ Blur placeholder

---

### 2. Font Optimization

```typescript
// pages/_document.tsx
<Head>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
</Head>
```

**Next.js 13+ (@next/font):**

```typescript
// Not available in Pages Router < 13
// Use _document.tsx method above
```

---

### 3. Script Optimization

```typescript
import Script from 'next/script';

export default function Page() {
  return (
    <>
      {/* Load after page interactive */}
      <Script
        src="https://www.google-analytics.com/analytics.js"
        strategy="afterInteractive"
      />
      
      {/* Load lazily */}
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
      />
      
      {/* Inline script */}
      <Script id="show-banner" strategy="lazyOnload">
        {`console.log('Page loaded')`}
      </Script>
    </>
  );
}
```

**Strategies:**
- `beforeInteractive` - Critical scripts (polyfills)
- `afterInteractive` - Analytics (default)
- `lazyOnload` - Non-critical (chat widgets)

---

### 4. Code Splitting

**Automatic:**
- Her sayfa otomatik split
- `pages/about.tsx` → `about.js` bundle

**Manual:**

```typescript
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/Chart'), {
  ssr: false,
});

export default function Analytics() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Show Chart
      </button>
      {showChart && <HeavyChart />}
    </div>
  );
}
```

---

### 5. Middleware (Edge Functions)

```typescript
// middleware.ts (root seviyede)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Authentication check
  const token = request.cookies.get('session_token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'my-value');
  
  return response;
}

// Hangi route'larda çalışacak?
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
```

**Use cases:**
- Authentication
- Redirects
- A/B testing
- Geolocation
- Bot detection

---

### 6. ISR (Incremental Static Regeneration)

```typescript
export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  
  return {
    props: { posts },
    revalidate: 60, // 60 saniyede bir revalidate
  };
};
```

**Nasıl çalışır?**
1. Build time'da static HTML oluştur
2. 60 saniye boyunca cache'ten serve et
3. 60 saniye sonra background'da yeni HTML oluştur
4. Yeni request'ler yeni HTML'i alır

---

## 🔌 Module Federation

### next.config.js Configuration

```javascript
// apps/shell/next.config.js
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'shell',
        remotes: {
          checkout: `checkout@http://localhost:3001/_next/static/${
            options.isServer ? 'ssr' : 'chunks'
          }/remoteEntry.js`,
          profile: `profile@http://localhost:3002/_next/static/${
            options.isServer ? 'ssr' : 'chunks'
          }/remoteEntry.js`,
        },
        filename: 'static/chunks/remoteEntry.js',
        shared: {
          react: { singleton: true, requiredVersion: false },
          'react-dom': { singleton: true, requiredVersion: false },
        },
      })
    );
    
    return config;
  },
};
```

### Usage in Pages

```typescript
// pages/dashboard.tsx
import dynamic from 'next/dynamic';

// Remote component import
const CheckoutWidget = dynamic(
  () => import('checkout/CheckoutWidget'),
  { ssr: false }
);

const ProfileCard = dynamic(
  () => import('profile/ProfileCard'),
  { ssr: false }
);

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <CheckoutWidget />
      <ProfileCard userId="123" />
    </div>
  );
}
```

### Type Declarations

```typescript
// types/federation.d.ts
declare module 'checkout/CheckoutWidget' {
  const CheckoutWidget: React.ComponentType<{
    onComplete?: (data: any) => void;
  }>;
  export default CheckoutWidget;
}

declare module 'profile/ProfileCard' {
  const ProfileCard: React.ComponentType<{
    userId: string;
  }>;
  export default ProfileCard;
}
```

---

## ❌ Error Handling

### Error Boundary Pattern

```typescript
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught:', error, errorInfo);
    // Send to Sentry/Datadog
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage in _app.tsx
import ErrorBoundary from '@/components/ErrorBoundary';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
```

**Error Boundary nereden geliyor?**
- React'in kendi özelliği (React 16+)
- Class component olmalı
- `getDerivedStateFromError` ve `componentDidCatch` method'ları
- Functional component'te kullanılamaz

---

### Custom 404 Page

```typescript
// pages/404.tsx
import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Sayfa Bulunamadı</h1>
      <p>Aradığınız sayfa mevcut değil.</p>
      <Link href="/">
        <a>Ana Sayfaya Dön</a>
      </Link>
    </div>
  );
}
```

---

### Custom 500 Page

```typescript
// pages/500.tsx
export default function Custom500() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>500 - Server Hatası</h1>
      <p>Bir şeyler ters gitti.</p>
    </div>
  );
}
```

---

## 🔗 Navigation

### Link Component

```typescript
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      {/* Basic link */}
      <Link href="/about">About</Link>
      
      {/* Dynamic link */}
      <Link href={`/blog/${post.slug}`}>
        {post.title}
      </Link>
      
      {/* With query params */}
      <Link
        href={{
          pathname: '/blog',
          query: { category: 'tech' },
        }}
      >
        Tech Blog
      </Link>
      
      {/* External link (normal <a>) */}
      <a href="https://example.com" target="_blank" rel="noopener">
        External
      </a>
      
      {/* Prefetch disabled */}
      <Link href="/heavy" prefetch={false}>
        Heavy Page
      </Link>
    </div>
  );
}
```

**Link Features:**
- ✅ Client-side navigation (SPA-like)
- ✅ Automatic prefetching (viewport'ta göründüğünde)
- ✅ Scroll to top (default)
- ✅ Route transition

---

### useRouter Hook

```typescript
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  
  // Current route info
  console.log(router.pathname);    // "/blog/[slug]"
  console.log(router.query);       // { slug: "hello" }
  console.log(router.asPath);      // "/blog/hello?foo=bar"
  
  // Navigation
  const handleClick = () => {
    router.push('/about');
    // router.push({ pathname: '/blog', query: { id: '1' } });
    // router.replace('/about'); // No history entry
    // router.back();
    // router.reload();
  };
  
  // Route events
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      console.log('Route changed to:', url);
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);
  
  return <button onClick={handleClick}>Go to About</button>;
}
```

---

## 🎯 Best Practices

### 1. File Organization

```
my-app/
├── pages/                  # Routes only
├── components/             # UI components
│   ├── ui/                # Reusable UI (Button, Input)
│   └── features/          # Feature-specific (CheckoutForm)
├── lib/                    # Utilities
│   ├── api.ts             # API helpers
│   ├── auth.ts            # Auth utils
│   └── constants.ts       # Constants
├── hooks/                  # Custom hooks
├── store/                  # State management (Zustand)
├── styles/                 # Global styles
├── types/                  # TypeScript types
└── public/                 # Static files
```

---

### 2. TypeScript Best Practices

```typescript
// Use NextPage type
import type { NextPage } from 'next';

const HomePage: NextPage = () => {
  return <h1>Home</h1>;
};

// Use GetStaticProps type
import type { GetStaticProps, InferGetStaticPropsType } from 'next';

export const getStaticProps: GetStaticProps<{ posts: Post[] }> = async () => {
  const posts = await fetchPosts();
  return { props: { posts } };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const BlogPage: NextPage<Props> = ({ posts }) => {
  return <div>{posts.map(...)}</div>;
};
```

---

### 3. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgres://...
SECRET_KEY=supersecret
```

```typescript
// Client-side (NEXT_PUBLIC_ prefix gerekli)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Server-side only
export const getServerSideProps = async () => {
  const secret = process.env.SECRET_KEY; // ✅ Safe
  return { props: {} };
};
```

---

### 4. API Routes

```typescript
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    // Handle POST
    res.status(200).json({ message: 'POST request' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

---

### 5. SEO Optimization

```typescript
import Head from 'next/head';

export default function Page() {
  return (
    <>
      <Head>
        <title>My Page Title</title>
        <meta name="description" content="Page description" />
        <meta property="og:title" content="My Page Title" />
        <meta property="og:description" content="Page description" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://example.com/page" />
      </Head>
      <h1>Content</h1>
    </>
  );
}
```

---

## 📊 Comparison: Pages Router vs App Router

| Feature | Pages Router | App Router (13+) |
|---------|-------------|------------------|
| **Release** | 2016 | 2022 |
| **Routing** | File-based | Folder-based |
| **Layouts** | Manual pattern | Built-in |
| **Data fetching** | getStaticProps, getServerSideProps | Server Components |
| **Loading UI** | Manual | Built-in loading.tsx |
| **Error UI** | _error.tsx | error.tsx |
| **Streaming** | ❌ | ✅ |
| **Suspense** | Partial | Full |
| **Server Components** | ❌ | ✅ |
| **Status** | ✅ Stable, maintained | ✅ Stable (13.4+) |

**Should you use Pages Router?**
- ✅ Existing projects (migration costly)
- ✅ Stable, battle-tested
- ✅ More examples/resources
- ✅ Module Federation (better support)
- ⚠️ No server components
- ⚠️ Manual layout patterns

---

## 🎓 Özet

### Pages Router'ın Güçlü Yanları

1. **File-based routing** - Kolay, anlaşılır
2. **Hybrid rendering** - SSG, SSR, CSR bir arada
3. **API Routes** - Backend endpoints kolayca
4. **Image/Font optimization** - Built-in
5. **Module Federation** - İyi çalışır
6. **Maturity** - Stabil, uzun süredir var

### Temel Kavramlar Özeti

| Kavram | Açıklama |
|--------|----------|
| `_app.tsx` | Global wrapper (layout, providers) |
| `_document.tsx` | HTML structure (fonts, meta) |
| `getStaticProps` | Build time data fetch (SSG) |
| `getServerSideProps` | Request time data fetch (SSR) |
| `getInitialProps` | Legacy (SSR + CSR) |
| `dynamic()` | Lazy loading, ssr: false |
| `Link` | Client-side navigation |
| `useRouter` | Route info, navigation |
| `Image` | Optimized images |
| `Script` | Optimized scripts |
| `Head` | SEO meta tags |
| `middleware` | Edge functions |
| `ISR` | Static + revalidate |

---

**Son güncelleme:** 2026-08-15

**Versiyon:** Next.js 12-13 Pages Router

**Durum:** ✅ Production-ready, battle-tested
