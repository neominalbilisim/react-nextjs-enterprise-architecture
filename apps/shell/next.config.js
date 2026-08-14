process.env.NEXT_PRIVATE_LOCAL_WEBPACK = "true";

const NextFederationPlugin = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // MODÜL 5 · Host (shell-app) Yapılandırması
  // 'remotes' listesi, hangi bağımsız Remote uygulamaların runtime'da
  // içeri yükleneceğini tanımlar. Her Remote kendi CI/CD pipeline'ıyla
  // ayrı deploy edilebilir — Host sadece remoteEntry.js'in URL'ini bilir.
  webpack(config, options) {
    const { isServer } = options;

    config.plugins.push(
      new NextFederationPlugin({
        name: "shell",
        filename: "static/chunks/remoteEntry.js",
        remotes: {
          checkout: `checkout@${
            process.env.NEXT_PUBLIC_CHECKOUT_URL || "http://localhost:3001"
          }/_next/static/${isServer ? "ssr" : "chunks"}/remoteEntry.js`,
          profile: `profile@${
            process.env.NEXT_PUBLIC_PROFILE_URL || "http://localhost:3002"
          }/_next/static/${isServer ? "ssr" : "chunks"}/remoteEntry.js`,
        },
        // React/react-dom paylaşımını nextjs-mf otomatik yönetir (singleton).
        // Burada ayrıca tanımlamak SSR'de çift React kopyası üretir.
        shared: {},
      })
    );

    return config;
  },
};

module.exports = nextConfig;
