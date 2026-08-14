process.env.NEXT_PRIVATE_LOCAL_WEBPACK = "true";

const NextFederationPlugin = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // MODÜL 5 · Remote (checkout-app) Yapılandırması
  // 'exposes' ile hangi component'lerin Host tarafından import
  // edilebileceği tanımlanır. Bu uygulama shell-app'ten TAMAMEN
  // habersiz build edilip deploy edilebilir.
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "checkout",
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./CheckoutWidget": "./components/CheckoutWidget.tsx",
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
