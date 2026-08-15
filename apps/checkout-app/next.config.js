process.env.NEXT_PRIVATE_LOCAL_WEBPACK = "true";

const NextFederationPlugin = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // MODÜL 5 & 6 · Remote (checkout-app) Yapılandırması
  // 'exposes' ile hangi component'lerin Host tarafından import
  // edilebileceği tanımlanır. Bu uygulama shell-app'ten TAMAMEN
  // habersiz build edilip deploy edilebilir.
  //
  // MODÜL 6 Eklentisi: Hem METHOD 1 (component expose) hem METHOD 2 (flow expose)
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "checkout",
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          // METHOD 1: Basit widget/component expose
          // → Dashboard gibi yerlerde küçük widget olarak kullanılır
          "./CheckoutWidget": "./components/CheckoutWidget.tsx",
          
          // METHOD 1: Individual step components (low-level)
          // → Sadece UI component'leri, routing logic yok
          "./CheckoutStep1": "./components/CheckoutStep1.tsx",
          "./CheckoutStep2": "./components/CheckoutStep2.tsx",
          "./CheckoutConfirmation": "./components/CheckoutConfirmation.tsx",
          
          // METHOD 1: Page components with routing (RECOMMENDED)
          // → checkout-app'in kendi route'ları, shell bunları import eder
          "./pages/CheckoutStep1Page": "./pages/checkout/step1.tsx",
          "./pages/CheckoutStep2Page": "./pages/checkout/step2.tsx",
          "./pages/CheckoutConfirmationPage": "./pages/checkout/confirmation.tsx",
          
          // METHOD 2: Complete flow with internal routing
          // → Kendi routing'ini yöneten kompleks flow component
          "./CheckoutFlow": "./components/CheckoutFlow.tsx",
        },
        shared: {
          // Bu, tek bundle paylaşımı demek 
          zustand: { singleton: true, requiredVersion: "^4.5.0" },
          // react: { singleton: true }
          //  TypeError: Cannot read properties of null (reading 'useState')
          // @module-federation/nextjs-mf ile shared: {} içinde react, Next internals otomatik paylaşılır (plugin halleder), 
          // Eğer elle eklersek bu durum oluşur.
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
