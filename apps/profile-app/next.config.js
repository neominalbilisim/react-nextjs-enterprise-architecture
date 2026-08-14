process.env.NEXT_PRIVATE_LOCAL_WEBPACK = "true";

const NextFederationPlugin = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // MODÜL 5 · Remote (profile-app) Yapılandırması
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "profile",
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./ProfileWidget": "./components/ProfileWidget.tsx",
        },
        shared: {},
      })
    );

    return config;
  },
};

module.exports = nextConfig;
